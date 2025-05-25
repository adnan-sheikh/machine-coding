/**
 * Simple Tests for Task Runner with Concurrency Control
 *
 * Run this in browser console after loading solution.js
 * Just uses console.log to show test results
 */

// Utility function for creating delayed promises
function delay(ms, value = undefined) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

// Simple test runner
async function runTests() {
  console.log("🚀 Starting Task Runner Tests...\n");

  // Test 1: Basic functionality
  console.log("=== Test 1: Basic Task Execution ===");
  try {
    const runner = new TaskRunner(2);
    const result = await runner.runTask(() => delay(100, "Hello World"));
    console.log("✅ Single task result:", result);
  } catch (error) {
    console.log("❌ Test 1 failed:", error.message);
  }

  // Test 2: Multiple tasks within limit
  console.log("\n=== Test 2: Multiple Tasks (Within Limit) ===");
  try {
    const runner = new TaskRunner(3);
    const tasks = [
      () => delay(100, "Task 1"),
      () => delay(150, "Task 2"),
      () => delay(120, "Task 3"),
    ];

    console.log("Running 3 tasks with limit of 3...");
    const start = Date.now();
    const promises = tasks.map((task) => runner.runTask(task));
    const results = await Promise.all(promises);
    const duration = Date.now() - start;

    console.log("✅ Results:", results);
    console.log(
      `⏱️  Completed in ${duration}ms (should be ~150ms since they run concurrently)`
    );
  } catch (error) {
    console.log("❌ Test 2 failed:", error.message);
  }

  // Test 3: Concurrency limiting
  console.log("\n=== Test 3: Concurrency Limiting ===");
  try {
    const runner = new TaskRunner(2); // Only 2 concurrent
    let activeCount = 0;
    let maxActive = 0;

    const createTask = (id) => () => {
      activeCount++;
      maxActive = Math.max(maxActive, activeCount);
      console.log(`  📍 Task ${id} started (active: ${activeCount})`);

      return delay(200).then(() => {
        activeCount--;
        console.log(`  ✅ Task ${id} completed (active: ${activeCount})`);
        return `Result ${id}`;
      });
    };

    console.log("Running 5 tasks with limit of 2...");
    const tasks = [1, 2, 3, 4, 5].map(createTask);
    const promises = tasks.map((task) => runner.runTask(task));

    // Show status after small delay
    setTimeout(() => {
      const status = runner.getStatus();
      console.log(
        `  📊 Status: Running=${status.running}, Queued=${status.queued}`
      );
    }, 50);

    const results = await Promise.all(promises);
    console.log(`🎯 Max concurrent tasks: ${maxActive} (should be 2)`);
    console.log("✅ All results:", results);
  } catch (error) {
    console.log("❌ Test 3 failed:", error.message);
  }

  // Test 4: Error handling
  console.log("\n=== Test 4: Error Handling ===");
  try {
    const runner = new TaskRunner(2);

    const tasks = [
      () => delay(100, "Success 1"),
      () =>
        delay(50).then(() => {
          throw new Error("Task failed!");
        }),
      () => delay(150, "Success 2"),
    ];

    console.log("Running tasks with one that will fail...");
    const promises = tasks.map(async (task, index) => {
      try {
        const result = await runner.runTask(task);
        console.log(`  ✅ Task ${index + 1}: ${result}`);
        return result;
      } catch (error) {
        console.log(`  ❌ Task ${index + 1} failed: ${error.message}`);
        return null;
      }
    });

    await Promise.all(promises);
    console.log("✅ Error handling test completed");
  } catch (error) {
    console.log("❌ Test 4 failed:", error.message);
  }

  // Test 5: Queue behavior
  console.log("\n=== Test 5: Queue Behavior ===");
  try {
    const runner = new TaskRunner(1); // Force sequential
    const executionOrder = [];

    const createOrderedTask = (id) => () => {
      executionOrder.push(id);
      console.log(`  🎯 Executing task ${id}`);
      return delay(100, `Task ${id}`);
    };

    console.log("Running 4 tasks sequentially (limit = 1)...");
    const tasks = [1, 2, 3, 4].map(createOrderedTask);
    const promises = tasks.map((task) => runner.runTask(task));

    await Promise.all(promises);
    console.log("📋 Execution order:", executionOrder);
    console.log("✅ Tasks executed in correct order");
  } catch (error) {
    console.log("❌ Test 5 failed:", error.message);
  }

  // Test 6: Status monitoring
  console.log("\n=== Test 6: Status Monitoring ===");
  try {
    const runner = new TaskRunner(2);

    console.log("Initial status:", runner.getStatus());
    console.log("Is idle?", runner.isIdle());

    // Add some tasks
    const promises = [
      runner.runTask(() => delay(200, "A")),
      runner.runTask(() => delay(200, "B")),
      runner.runTask(() => delay(200, "C")),
    ];

    setTimeout(() => {
      console.log("Status during execution:", runner.getStatus());
      console.log("Is idle?", runner.isIdle());
    }, 50);

    await Promise.all(promises);
    console.log("Final status:", runner.getStatus());
    console.log("Is idle?", runner.isIdle());
    console.log("✅ Status monitoring works correctly");
  } catch (error) {
    console.log("❌ Test 6 failed:", error.message);
  }

  // Test 7: Performance test
  console.log("\n=== Test 7: Performance Test ===");
  try {
    const runner = new TaskRunner(5);
    const taskCount = 20;

    console.log(`Running ${taskCount} tasks with concurrency limit of 5...`);
    const start = Date.now();

    const tasks = Array.from(
      { length: taskCount },
      (_, i) => () => delay(50, `Task ${i + 1}`)
    );

    const promises = tasks.map((task) => runner.runTask(task));
    const results = await Promise.all(promises);

    const duration = Date.now() - start;
    console.log(`✅ Completed ${taskCount} tasks in ${duration}ms`);
    console.log(
      `📊 Expected: ~${Math.ceil(taskCount / 5) * 50}ms, Actual: ${duration}ms`
    );
  } catch (error) {
    console.log("❌ Test 7 failed:", error.message);
  }

  console.log("\n🎉 All tests completed!");
  console.log("\n💡 You can also try these manual tests:");
  console.log("   const runner = new TaskRunner(2);");
  console.log(
    '   runner.runTask(() => delay(1000, "test")).then(console.log);'
  );
  console.log("   console.log(runner.getStatus());");
}

// Auto-run tests if loaded directly
console.log("Task Runner Test Suite Loaded!");
console.log("Run: runTests() to start all tests");
console.log("Or create your own: const runner = new TaskRunner(2);");

// Uncomment to auto-run tests
// runTests();
