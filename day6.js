
// Day 6: Callback Task Processor
// Level: Beginner
// Concepts: Functions as Values, Callback Functions,
// Higher-Order Functions, Arrow Functions, and Return Values.

// 1. CREATE TASK DATA
// Each task is an object describing work that needs to be done.
const tasks = [
    { title: "Learn JavaScript", priority: "High" },
    { title: "Practise Git", priority: "Medium" },
    { title: "Read Documentation", priority: "Low" }
];


// 2. CREATE FUNCTIONS THAT PROCESS ONE TASK
// These functions accept a task object and return formatted text.

// This function creates a simple task description.
function describeTask(task) {
    return task.title + " - Priority: " + task.priority;
}

// An arrow function is another way to write a function.
// Here, it returns the task title in uppercase.
const formatTaskTitle = (task) => task.title.toUpperCase();


// 3. PASS A FUNCTION AS AN ARGUMENT
// A callback is a function passed to another function.
// processTask() calls the callback it receives.
function processTask(task, callback) {
    return callback(task);
}

console.log("--- SINGLE TASK PROCESSING ---");

// Pass describeTask as a value, without calling it with () here.
// processTask() will call it and pass the task to it.
const firstResult = processTask(tasks[0], describeTask);
console.log(firstResult);

// We can pass a different callback to change the result.
const secondResult = processTask(tasks[1], formatTaskTitle);
console.log(secondResult);


// 4. CREATE A HIGHER-ORDER FUNCTION
// A higher-order function takes a function as an argument
// or returns a function.
// This one accepts a list of tasks and a callback function.
function processTasks(taskList, callback) {
    console.log("\n--- PROCESSING ALL TASKS ---");

    for (const task of taskList) {
        // The same callback is applied to each task.
        const result = callback(task);
        console.log(result);
    }
}

// Reuse the same processing function with different callbacks.
processTasks(tasks, describeTask);

processTasks(tasks, formatTaskTitle);


// 5. USE AN ARROW FUNCTION AS A CALLBACK
// We can create a small function directly where it is needed.
// This callback returns a task's title and priority together.
console.log("\n--- CUSTOM CALLBACK ---");

processTasks(tasks, (task) => {
    return "[" + task.priority + "] " + task.title;
});


// 6. RETURN A RESULT FROM A HIGHER-ORDER FUNCTION
// This function uses a callback to find tasks matching a condition.
// It returns a new array containing only matching tasks.
function filterTasks(taskList, condition) {
    const matchingTasks = [];

    for (const task of taskList) {
        // condition is a callback that returns true or false.
        if (condition(task)) {
            matchingTasks.push(task);
        }
    }

    return matchingTasks;
}

// Pass an arrow function that checks for High priority.
const highPriorityTasks = filterTasks(tasks, (task) => {
    return task.priority === "High";
});

console.log("\n--- HIGH PRIORITY TASKS ---");

for (const task of highPriorityTasks) {
    console.log(task.title);
}

/*
EXPECTED OUTPUT

--- SINGLE TASK PROCESSING ---
Learn JavaScript - Priority: High
PRACTISE GIT

--- PROCESSING ALL TASKS ---
Learn JavaScript - Priority: High
Practise Git - Priority: Medium
Read Documentation - Priority: Low

--- PROCESSING ALL TASKS ---
LEARN JAVASCRIPT
PRACTISE GIT
READ DOCUMENTATION

--- CUSTOM CALLBACK ---
[High] Learn JavaScript
[Medium] Practise Git
[Low] Read Documentation

--- HIGH PRIORITY TASKS ---
Learn JavaScript
*/