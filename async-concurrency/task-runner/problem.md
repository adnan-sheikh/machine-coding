# Task Runner with Concurrency Control

## 📋 Problem Statement

Implement a task runner that can execute multiple asynchronous tasks with a configurable concurrency limit. When the concurrency limit is reached, additional tasks should be queued and executed only after currently running tasks complete.

**Real-world scenario**: You have 100 API calls to make, but your server can only handle 5 concurrent requests to avoid rate limiting. You need a system that runs 5 at a time and automatically starts the next one when any of the current 5 finishes.

## 🎯 Requirements

- [ ] **Concurrency Control**: Limit the maximum number of tasks running simultaneously
- [ ] **Queue Management**: Queue excess tasks when limit is reached
- [ ] **Promise-based API**: Each task should return a Promise that resolves when complete
- [ ] **Error Handling**: Handle task failures without breaking the entire system
- [ ] **Status Monitoring**: Provide visibility into running/queued task counts
- [ ] **Sequential Processing**: Tasks should be processed in the order they were added
- [ ] **Dynamic Task Addition**: Allow adding new tasks while others are running

## 💡 Key Concepts

- Promise management and chaining
- Queue data structure (FIFO)
- Async/await patterns
- Error boundaries and isolation
- Callback/event handling
- Concurrency vs Parallelism

## 🏢 Companies

- Google (Frontend/Backend roles)
- Meta (JavaScript heavy positions)
- Netflix (Full-stack engineers)
- Flipkart (Senior frontend roles)
- Swiggy (Full-stack developers)
- Zomato (Backend/Frontend roles)

## ⏱️ Time Limit

60 minutes

## 🧪 Test Cases

```javascript
// Test case 1: Basic functionality
const runner = new TaskRunner(2); // Max 2 concurrent
const tasks = [
  () => delay(1000).then(() => "Task 1"),
  () => delay(1500).then(() => "Task 2"),
  () => delay(800).then(() => "Task 3"),
  () => delay(1200).then(() => "Task 4"),
];

// Should run first 2 immediately, queue remaining 2
const promises = tasks.map((task) => runner.runTask(task));
const results = await Promise.all(promises);
// Expected: ['Task 1', 'Task 2', 'Task 3', 'Task 4']

// Test case 2: Error handling
const taskWithError = () => Promise.reject(new Error("Task failed"));
const normalTask = () => Promise.resolve("Success");

const errorPromise = runner.runTask(taskWithError);
const successPromise = runner.runTask(normalTask);

// Error should be isolated, success task should still work

// Test case 3: Status monitoring
console.log(runner.getStatus());
// Expected: { running: 1, queued: 2, limit: 2 }
```

## 🚀 Implementation

### Approach 1: Queue-based with Recursive Processing

```javascript
// Your solution here
```

### Approach 2: Event-driven Alternative (Optional)

```javascript
// Alternative solution using events
```

## 🧪 Tests

```javascript
// Test implementation
```

## 🎓 Learnings

- Understanding the difference between concurrency control and throttling
- Promise resolution patterns and error isolation
- Queue management in JavaScript
- Recursive task processing patterns

## 🔗 Related Problems

<!-- - [Debounce/Throttle Functions](../../utilities/debounce-throttle/)
- [Promise.all() with Retry Logic](../promise-retry/)
- [Rate Limiter Implementation](../../system-design/rate-limiter/) -->

## 📚 Background Knowledge

**Why this problem matters:**

- No native JavaScript API provides concurrency limiting
- Common in real applications (API rate limiting, resource management)
- Tests understanding of async patterns and Promise management
- Demonstrates ability to build utility functions from scratch

**Popular libraries that solve this:**

- `p-limit` - Most popular concurrency limiter
- `p-queue` - Priority queue with concurrency control
- `async.queue` - Part of the async utility library
