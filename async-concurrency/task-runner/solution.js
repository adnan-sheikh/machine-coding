/**
 * Task Runner with Concurrency Control
 *
 * A utility class that executes asynchronous tasks with a configurable
 * concurrency limit. Tasks exceeding the limit are queued and executed
 * as slots become available.
 */

class TaskRunner {
  /**
   * Create a new TaskRunner instance
   * @param {number} concurrencyLimit - Maximum number of tasks to run simultaneously
   */
  constructor(concurrencyLimit = 3) {
    if (concurrencyLimit <= 0) {
      throw new Error("Concurrency limit must be greater than 0");
    }

    this.concurrencyLimit = concurrencyLimit;
    this.runningTasks = 0;
    this.taskQueue = [];
  }

  /**
   * Add a task to the runner and execute it when a slot is available
   * @param {Function} taskFunction - Async function that returns a Promise
   * @returns {Promise} Promise that resolves with the task result
   */
  async runTask(taskFunction) {
    // Validate input
    if (typeof taskFunction !== "function") {
      throw new Error("Task must be a function");
    }

    return new Promise((resolve, reject) => {
      // Add task to queue with its resolve/reject handlers
      this.taskQueue.push({
        taskFunction,
        resolve,
        reject,
        timestamp: Date.now(), // For debugging/monitoring
      });

      // Try to execute tasks from queue
      this.processTasks();
    });
  }

  /**
   * Process tasks from the queue, respecting concurrency limits
   * @private
   */
  processTasks() {
    // If we're at capacity or no tasks waiting, return early
    if (
      this.runningTasks >= this.concurrencyLimit ||
      this.taskQueue.length === 0
    ) {
      return;
    }

    // Get the next task from the front of the queue (FIFO)
    const { taskFunction, resolve, reject, timestamp } = this.taskQueue.shift();
    this.runningTasks++;

    // Execute the task with proper error handling
    this.executeTask(taskFunction)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        // Task completed (success or failure), free up the slot
        this.runningTasks--;

        // Recursively process the next task in queue
        this.processTasks();
      });
  }

  /**
   * Execute a single task with error isolation
   * @param {Function} taskFunction - The task to execute
   * @returns {Promise} Promise that resolves with task result
   * @private
   */
  async executeTask(taskFunction) {
    try {
      const result = await taskFunction();
      return result;
    } catch (error) {
      // Re-throw to be handled by the caller
      throw error;
    }
  }

  /**
   * Get current status of the task runner
   * @returns {Object} Status object with running, queued, and limit counts
   */
  getStatus() {
    return {
      running: this.runningTasks,
      queued: this.taskQueue.length,
      limit: this.concurrencyLimit,
      totalSlots: this.concurrencyLimit,
      availableSlots: this.concurrencyLimit - this.runningTasks,
    };
  }

  /**
   * Check if the runner is currently idle (no running or queued tasks)
   * @returns {boolean} True if idle, false otherwise
   */
  isIdle() {
    return this.runningTasks === 0 && this.taskQueue.length === 0;
  }

  /**
   * Wait for all current tasks to complete
   * @returns {Promise} Promise that resolves when all tasks are done
   */
  async waitForIdle() {
    return new Promise((resolve) => {
      const checkIdle = () => {
        if (this.isIdle()) {
          resolve();
        } else {
          // Check again in next tick
          setTimeout(checkIdle, 10);
        }
      };
      checkIdle();
    });
  }

  /**
   * Clear all queued tasks (does not affect currently running tasks)
   * @returns {number} Number of tasks that were cleared
   */
  clearQueue() {
    const clearedCount = this.taskQueue.length;

    // Reject all queued tasks
    this.taskQueue.forEach(({ reject }) => {
      reject(new Error("Task cancelled - queue cleared"));
    });

    this.taskQueue = [];
    return clearedCount;
  }

  /**
   * Update the concurrency limit (affects future task scheduling)
   * @param {number} newLimit - New concurrency limit
   */
  setConcurrencyLimit(newLimit) {
    if (newLimit <= 0) {
      throw new Error("Concurrency limit must be greater than 0");
    }

    this.concurrencyLimit = newLimit;

    // If new limit is higher, try to process more tasks
    if (newLimit > this.runningTasks) {
      this.processTasks();
    }
  }
}

// Alternative implementation using Set for tracking running tasks
class TaskRunnerAlternative {
  constructor(concurrencyLimit = 3) {
    this.concurrencyLimit = concurrencyLimit;
    this.runningTasks = new Set();
    this.taskQueue = [];
  }

  async runTask(taskFunction) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ taskFunction, resolve, reject });
      this.processTasks();
    });
  }

  processTasks() {
    if (
      this.runningTasks.size >= this.concurrencyLimit ||
      this.taskQueue.length === 0
    ) {
      return;
    }

    const { taskFunction, resolve, reject } = this.taskQueue.shift();

    // Create a promise that tracks this specific task
    const taskPromise = this.executeTask(taskFunction, resolve, reject);
    this.runningTasks.add(taskPromise);

    // Remove from running set when complete
    taskPromise.finally(() => {
      this.runningTasks.delete(taskPromise);
      this.processTasks();
    });
  }

  async executeTask(taskFunction, resolve, reject) {
    try {
      const result = await taskFunction();
      resolve(result);
      return result;
    } catch (error) {
      reject(error);
      throw error;
    }
  }

  getStatus() {
    return {
      running: this.runningTasks.size,
      queued: this.taskQueue.length,
      limit: this.concurrencyLimit,
    };
  }
}

// Utility function for creating delayed promises (useful for testing)
function delay(ms, value = undefined) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

// Export for use in tests and other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TaskRunner, TaskRunnerAlternative, delay };
}

// For browser environments
if (typeof window !== "undefined") {
  window.TaskRunner = TaskRunner;
  window.TaskRunnerAlternative = TaskRunnerAlternative;
  window.delay = delay;
}
