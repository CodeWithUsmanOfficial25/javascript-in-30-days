
/*
Day 16: Task Processing System
Concepts: Promises, async/await, try...catch...finally, Error Handling
*/

// Store the tasks that our system needs to process.
const tasks = [
    { id: 1, name: "Generate Report", shouldFail: false },
    { id: 2, name: "Send Email", shouldFail: true },
    { id: 3, name: "Backup Database", shouldFail: false },
    { id: 4, name: "Sync Records", shouldFail: false }
];

// Custom error class taake task failures ko clearly identify kar saken.
class TaskProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = "TaskProcessingError";
    }
}

// Simulate an asynchronous task using a Promise.
function processTask(task) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (task.shouldFail) {
                reject(
                    new TaskProcessingError(
                        `${task.name} could not be completed.`
                    )
                );
            } else {
                resolve({
                    id: task.id,
                    name: task.name,
                    status: "Completed"
                });
            }
        }, 500);
    });
}

// Process each task and handle errors without stopping the whole queue.
async function runTaskQueue(taskList) {
    const successfulTasks = [];
    const failedTasks = [];

    console.log("===== TASK PROCESSING SYSTEM =====\n");

    for (const task of taskList) {
        console.log(`Starting: ${task.name}`);

        try {
            // await Promise ka result aane tak wait karega.
            const result = await processTask(task);

            successfulTasks.push(result);
            console.log(`Success: ${result.name}`);
        } catch (error) {
            // Agar task fail ho, error record karo aur next task chalao.
            failedTasks.push({
                id: task.id,
                name: task.name,
                error: error.message
            });

            console.log(`Failed: ${error.message}`);
        } finally {
            // Ye block success aur failure dono cases mein chalega.
            console.log(`Finished: ${task.name}\n`);
        }
    }

    displaySummary(successfulTasks, failedTasks);
}

// Display a summary using the results collected above.
function displaySummary(successfulTasks, failedTasks) {
    console.log("===== FINAL SUMMARY =====");
    console.log(`Total Tasks: ${successfulTasks.length + failedTasks.length}`);
    console.log(`Successful Tasks: ${successfulTasks.length}`);
    console.log(`Failed Tasks: ${failedTasks.length}`);

    console.log("\nCompleted Tasks:");

    successfulTasks.forEach((task) => {
        console.log(`- ${task.name}`);
    });

    console.log("\nFailed Tasks:");

    if (failedTasks.length === 0) {
        console.log("No tasks failed.");
    } else {
        failedTasks.forEach((task) => {
            console.log(`- ${task.name}: ${task.error}`);
        });
    }
}

// Start the asynchronous task queue.
runTaskQueue(tasks).catch((error) => {
    console.error("Unexpected system error:", error.message);
});


/*
OUTPUT
===== TASK PROCESSING SYSTEM =====

Starting: Generate Report
Success: Generate Report
Finished: Generate Report

Starting: Send Email
Failed: Send Email could not be completed.
Finished: Send Email

Starting: Backup Database
Success: Backup Database
Finished: Backup Database

Starting: Sync Records
Success: Sync Records
Finished: Sync Records

===== FINAL SUMMARY =====
Total Tasks: 4
Successful Tasks: 3
Failed Tasks: 1

Completed Tasks:
- Generate Report
- Backup Database
- Sync Records

Failed Tasks:
- Send Email: Send Email could not be completed.

[Done] exited with code=0 in 2.507 seconds

*/