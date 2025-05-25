# Task Runner with Concurrency Control

> 📁 **Quick Access**: [Problem Statement](./problem.md) | [Solution](./solution.js) | [Tests](./test.js)

## 📋 Problem Statement

Implement a task runner that can execute multiple asynchronous tasks with a configurable concurrency limit. When the concurrency limit is reached, additional tasks should be queued and executed only after currently running tasks complete.

**Real-world scenario**: You have 100 API calls to make, but your server can only handle 5 concurrent requests to avoid rate limiting. You need a system that runs 5 at a time and automatically starts the next one when any of the current 5 finishes.

## 🎯 Key Requirements

- ✅ **Concurrency Control**: Limit the maximum number of tasks running simultaneously
- ✅ **Queue Management**: Queue excess tasks when limit is reached
- ✅ **Promise-based API**: Each task should return a Promise that resolves when complete
- ✅ **Error Handling**: Handle task failures without breaking the entire system
- ✅ **Status Monitoring**: Provide visibility into running/queued task counts

## 🏢 Companies That Ask This

- Rippling

## ⏱️ Time Limit

60 minutes

## 🚀 Quick Test

```javascript
// Create runner with max 2 concurrent tasks
const runner = new TaskRunner(2);

// Add 5 tasks (first 2 run immediately, rest queued)
const tasks = Array.from(
  { length: 5 },
  (_, i) => () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(`Task ${i + 1} done`), 1000)
    )
);

const promises = tasks.map((task) => runner.runTask(task));
const results = await Promise.all(promises);
console.log(results); // ['Task 1 done', 'Task 2 done', ...]
```

## 🧪 How to Test

### Browser Testing

```html
<script src="solution.js"></script>
<script src="test.js"></script>
<script>
  runTests();
</script>
```

### Node.js Testing

```bash
node test.js
```

## 💡 Key Learning Points

- **No native JS API** exists for concurrency limiting
- **Queue management** with FIFO processing
- **Promise resolution** patterns and error isolation
- **Recursive task processing** as slots become available

## 🔗 Related Problems

- [Debounce/Throttle Functions](../../utilities/debounce-throttle/)
- [Promise.all() with Retry Logic](../promise-retry/)
- [Rate Limiter Implementation](../../system-design/rate-limiter/)

## 📊 Solution Complexity

- **Time Complexity**: O(1) for adding tasks, O(n) total execution time
- **Space Complexity**: O(n) for queue storage
- **Difficulty**: ⭐⭐⭐ Medium (45-60 minutes)

---

## 🧠 Detailed Problem Description

### Requirements Deep Dive

**Core Functionality:**

```javascript
class TaskRunner {
  constructor(concurrencyLimit) {
    /* ... */
  }
  async runTask(taskFunction) {
    /* ... */
  }
  getStatus() {
    /* ... */
  }
}
```

**Expected Behavior:**

1. **Immediate execution** if under concurrency limit
2. **Queue management** when limit exceeded
3. **Automatic processing** as tasks complete
4. **Error isolation** - one failure doesn't break others
5. **Status visibility** - running/queued counts

### Test Cases

**Basic Usage:**

```javascript
const runner = new TaskRunner(2);

// This should work smoothly
const result = await runner.runTask(() =>
  fetch("/api/data").then((r) => r.json())
);
```

**Concurrency Control:**

```javascript
// Add 6 tasks with limit of 2
// First 2 start immediately, rest queue
// As each completes, next one starts
const promises = urls.map((url) => runner.runTask(() => fetch(url)));
```

**Error Handling:**

```javascript
// Failed tasks don't block others
const mixedTasks = [
  () => Promise.resolve("success"),
  () => Promise.reject("error"),
  () => Promise.resolve("also success"),
];
```

### Why This Problem Matters

**Real-world Applications:**

- 🌐 **API Rate Limiting** - Respect server limits
- 📁 **File Processing** - Process uploads without overwhelming system
- 🎮 **Game Development** - Manage concurrent animations
- 📊 **Data Processing** - Handle large datasets efficiently

**Interview Significance:**

- Tests understanding of **async patterns**
- Demonstrates **queue management** skills
- Shows **error handling** expertise
- Validates **system design** thinking

### Popular Alternatives

Since JavaScript lacks native concurrency control:

```javascript
// ❌ Promise.all() - No concurrency limit
await Promise.all(tasks); // Starts ALL tasks immediately

// ❌ Sequential - Too slow
for (const task of tasks) {
  await task(); // Waits for each one completely
}

// ✅ Our solution - Just right!
const runner = new TaskRunner(3);
await Promise.all(tasks.map((t) => runner.runTask(t)));
```

**Popular npm packages:**

- `p-limit` - Most popular concurrency limiter
- `p-queue` - Priority queue with concurrency control
- `async.queue` - Part of async utility library

---

_This implementation provides production-ready concurrency control that you can confidently discuss in technical interviews! 🚀_
