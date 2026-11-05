
class TaskQueueError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskQueueError";
  }
}

class TaskQueue {
  #queue = [];
  #completed = [];
  #failed = [];
  #nextId = 1;
  #processing = false;
  #maxRetries;

  constructor(maxRetries = 2) {
    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new TaskQueueError("Max retries must be a positive number.");
    }

    this.#maxRetries = maxRetries;
  }

  addTask(name, action, failAttempts = 0) {
    if (!name || typeof name !== "string") {
      throw new TaskQueueError("Task name is required.");
    }

    if (typeof action !== "function") {
      throw new TaskQueueError("Task must have a valid function.");
    }

    if (!Number.isInteger(failAttempts) || failAttempts < 0) {
      throw new TaskQueueError("Fail attempts must be a valid number.");
    }

    const task = {
      id: this.#nextId++,
      name,
      action,
      failAttempts,
      attempts: 0,
      status: "pending"
    };

    this.#queue.push(task);

    console.log(`Task added: ${name} (#${task.id})`);

    return task.id;
  }

  async #executeTask(task) {
    task.status = "processing";

    while (task.attempts <= this.#maxRetries) {
      task.attempts++;

      try {
        console.log(
          `Running "${task.name}" - Attempt ${task.attempts}`
        );

        const result = await task.action(task.attempts);

        task.status = "completed";
        task.result = result;

        this.#completed.push({
          id: task.id,
          name: task.name,
          attempts: task.attempts,
          result
        });

        console.log(`Completed: ${task.name}`);
        return;
      } catch (error) {
        console.log(`${task.name} failed: ${error.message}`);

        if (task.attempts > this.#maxRetries) {
          task.status = "failed";
          task.error = error.message;

          this.#failed.push({
            id: task.id,
            name: task.name,
            attempts: task.attempts,
            error: error.message
          });

          console.log(`Task permanently failed: ${task.name}`);
          return;
        }

        console.log(`Retrying "${task.name}"...`);
      }
    }
  }

  async processAll() {
    if (this.#processing) {
      throw new TaskQueueError("Queue is already processing.");
    }

    this.#processing = true;

    console.log("\n--- Starting Task Queue ---");

    try {
      while (this.#queue.length > 0) {
        const task = this.#queue.shift();
        await this.#executeTask(task);
      }
    } finally {
      this.#processing = false;
      console.log("\n--- Queue Processing Finished ---");
    }

    return this.getStats();
  }

  getStats() {
    return {
      completed: this.#completed.length,
      failed: this.#failed.length,
      pending: this.#queue.length,
      totalProcessed: this.#completed.length + this.#failed.length
    };
  }

  getCompletedTasks() {
    return [...this.#completed];
  }

  getFailedTasks() {
    return [...this.#failed];
  }
}

// A small delay to simulate work happening in the background.
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const queue = new TaskQueue(2);

queue.addTask("Send Welcome Email", async () => {
  await wait(500);
  return "Welcome email sent successfully";
});

queue.addTask("Generate Monthly Report", async (attempt) => {
  await wait(500);

  if (attempt < 3) {
    throw new Error("Report service is temporarily unavailable");
  }

  return "Monthly report generated";
});

queue.addTask("Upload Profile Image", async () => {
  await wait(500);
  return "Profile image uploaded";
});

queue.addTask("Sync Customer Records", async (attempt) => {
  await wait(500);

  if (attempt <= 3) {
    throw new Error("Database connection failed");
  }

  return "Customer records synchronized";
});

async function startDemo() {
  try {
    const stats = await queue.processAll();

    console.log("\n--- Final Statistics ---");
    console.table(stats);

    console.log("\n--- Completed Tasks ---");
    console.table(queue.getCompletedTasks());

    console.log("\n--- Failed Tasks ---");
    console.table(queue.getFailedTasks());
  } catch (error) {
    console.error("Queue Error:", error.message);
  }
}

startDemo();


/**
 OUTPUT

 [Running] node "f:\javascript-in-30-days\day29.js"
Task added: Send Welcome Email (#1)
Task added: Generate Monthly Report (#2)
Task added: Upload Profile Image (#3)
Task added: Sync Customer Records (#4)

--- Starting Task Queue ---
Running "Send Welcome Email" - Attempt 1
Completed: Send Welcome Email
Running "Generate Monthly Report" - Attempt 1
Generate Monthly Report failed: Report service is temporarily unavailable
Retrying "Generate Monthly Report"...
Running "Generate Monthly Report" - Attempt 2
Generate Monthly Report failed: Report service is temporarily unavailable
Retrying "Generate Monthly Report"...
Running "Generate Monthly Report" - Attempt 3
Completed: Generate Monthly Report
Running "Upload Profile Image" - Attempt 1
Completed: Upload Profile Image
Running "Sync Customer Records" - Attempt 1
Sync Customer Records failed: Database connection failed
Retrying "Sync Customer Records"...
Running "Sync Customer Records" - Attempt 2
Sync Customer Records failed: Database connection failed
Retrying "Sync Customer Records"...
Running "Sync Customer Records" - Attempt 3
Sync Customer Records failed: Database connection failed
Task permanently failed: Sync Customer Records

--- Queue Processing Finished ---

--- Final Statistics ---
┌────────────────┬────────┐
│ (index)        │ Values │
├────────────────┼────────┤
│ completed      │ 3      │
│ failed         │ 1      │
│ pending        │ 0      │
│ totalProcessed │ 4      │
└────────────────┴────────┘

--- Completed Tasks ---
┌─────────┬────┬───────────────────────────┬──────────┬───────────────────────────────────┐
│ (index) │ id │ name                      │ attempts │ result                            │
├─────────┼────┼───────────────────────────┼──────────┼───────────────────────────────────┤
│ 0       │ 1  │ 'Send Welcome Email'      │ 1        │ 'Welcome email sent successfully' │
│ 1       │ 2  │ 'Generate Monthly Report' │ 3        │ 'Monthly report generated'        │
│ 2       │ 3  │ 'Upload Profile Image'    │ 1        │ 'Profile image uploaded'          │
└─────────┴────┴───────────────────────────┴──────────┴───────────────────────────────────┘

--- Failed Tasks ---
┌─────────┬────┬─────────────────────────┬──────────┬──────────────────────────────┐
│ (index) │ id │ name                    │ attempts │ error                        │
├─────────┼────┼─────────────────────────┼──────────┼──────────────────────────────┤
│ 0       │ 4  │ 'Sync Customer Records' │ 3        │ 'Database connection failed' │
└─────────┴────┴─────────────────────────┴──────────┴──────────────────────────────┘

[Done] exited with code=0 in 4.246 seconds


 */