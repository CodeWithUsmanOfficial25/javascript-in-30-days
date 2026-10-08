
// Array of expense objects
const expense = [
    {
        name: "Internet Bill",
        category: "Utilities",
        amount: 3400,
        paid: true
    },
    {
        name: "Grocery",
        category: "Foods",
        amount: 3400,
        paid: true
    },
    {
        name: "Transport",
        category: "Travel",
        amount: 8400,
        paid: true
    },
    {
        name: "Netflix",
        category: "Entertainment",
        amount: 3120,
        paid: true
    },
    {
        name: "Electricity",
        category: "Utilities",
        amount: 6200,
        paid: false
    }
];

console.log("------------------------");
console.log("PERSONAL EXPENSE TRACKER");
console.log("------------------------");

// console.table() makes an array of objects easier to read

console.table(expense);

// let is used because the total will change as we add expenses

let totalexpense = 0;

// Accessing object properties through array indexes

totalexpense += expense[0].amount;
totalexpense += expense[1].amount;
totalexpense += expense[2].amount;
totalexpense += expense[3].amount;
totalexpense += expense[4].amount;

console.log("Total Expense :", totalexpense);