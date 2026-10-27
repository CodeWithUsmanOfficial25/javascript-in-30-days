
/*
 * Day 20: Personal Finance & Budget Analyzer
 * Concepts: Objects, Functions, Array Methods, Data Validation,
 * Sorting, Filtering, reduce(), find(), some(), and every().
 */

// Monthly budgets for different expense categories.
const monthlyBudgets = {
    Food: 8000,
    Transport: 4000,
    Shopping: 6000,
    Education: 10000,
    Entertainment: 3000,
    Bills: 5000
};

// Sample financial transactions for the month.
const transactions = [
    {
        id: 1,
        title: "Monthly Salary",
        category: "Income",
        type: "income",
        amount: 45000
    },
    {
        id: 2,
        title: "Freelance Project",
        category: "Income",
        type: "income",
        amount: 12000
    },
    {
        id: 3,
        title: "Grocery Shopping",
        category: "Food",
        type: "expense",
        amount: 3200
    },
    {
        id: 4,
        title: "University Transport",
        category: "Transport",
        type: "expense",
        amount: 1800
    },
    {
        id: 5,
        title: "Programming Course",
        category: "Education",
        type: "expense",
        amount: 4500
    },
    {
        id: 6,
        title: "Electricity Bill",
        category: "Bills",
        type: "expense",
        amount: 2600
    },
    {
        id: 7,
        title: "Clothing",
        category: "Shopping",
        type: "expense",
        amount: 7200
    },
    {
        id: 8,
        title: "Restaurant",
        category: "Food",
        type: "expense",
        amount: 2100
    },
    {
        id: 9,
        title: "Movie Tickets",
        category: "Entertainment",
        type: "expense",
        amount: 1500
    },
    {
        id: 10,
        title: "Internet Bill",
        category: "Bills",
        type: "expense",
        amount: 1800
    }
];

// Format amounts as Pakistani rupees.
function formatCurrency(amount) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
}

// Validate transaction data before analyzing it.
function validateTransaction(transaction) {
    const validTypes = ["income", "expense"];

    return (
        Number.isInteger(transaction.id) &&
        transaction.id > 0 &&
        typeof transaction.title === "string" &&
        transaction.title.trim().length > 0 &&
        typeof transaction.category === "string" &&
        transaction.category.trim().length > 0 &&
        validTypes.includes(transaction.type) &&
        Number.isFinite(transaction.amount) &&
        transaction.amount > 0
    );
}

// Keep only valid transactions.
const validTransactions = transactions.filter(validateTransaction);

// Separate income and expense transactions.
const incomeTransactions = validTransactions.filter(
    transaction => transaction.type === "income"
);

const expenseTransactions = validTransactions.filter(
    transaction => transaction.type === "expense"
);

// Calculate total income and expenses.
const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const totalExpenses = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const remainingBalance = totalIncome - totalExpenses;

// Calculate the average expense.
const averageExpense = expenseTransactions.length > 0
    ? totalExpenses / expenseTransactions.length
    : 0;

// Find the largest income and highest expense.
const largestIncome = incomeTransactions.reduce(
    (largest, transaction) =>
        transaction.amount > largest.amount ? transaction : largest,
    incomeTransactions[0]
);

const highestExpense = expenseTransactions.reduce(
    (highest, transaction) =>
        transaction.amount > highest.amount ? transaction : highest,
    expenseTransactions[0]
);

// Calculate total spending for each expense category.
const spendingByCategory = expenseTransactions.reduce(
    (summary, transaction) => {
        summary[transaction.category] =
            (summary[transaction.category] || 0) + transaction.amount;

        return summary;
    },
    {}
);

// Identify categories that have exceeded their budgets.
const budgetReport = Object.entries(monthlyBudgets).map(
    ([category, budget]) => {
        const spent = spendingByCategory[category] || 0;

        return {
            category,
            budget,
            spent,
            remaining: budget - spent,
            exceeded: spent > budget
        };
    }
);

// Sort expense categories from highest spending to lowest.
const sortedExpenses = [...budgetReport].sort(
    (a, b) => b.spent - a.spent
);

// Find transactions using their ID.
function findTransaction(id) {
    return validTransactions.find(transaction => transaction.id === id);
}

// Get all transactions belonging to a particular category.
function getTransactionsByCategory(category) {
    return validTransactions.filter(
        transaction =>
            transaction.category.toLowerCase() === category.toLowerCase()
    );
}

// Check whether the monthly finances meet certain conditions.
const hasBudgetOverrun = budgetReport.some(
    category => category.exceeded
);

const allTransactionsValid = transactions.every(validateTransaction);

const isBudgetUnderControl = budgetReport.every(
    category => !category.exceeded
);

// Display the financial summary.
console.log("========================================");
console.log("       PERSONAL FINANCE ANALYZER");
console.log("========================================");

console.log(`Valid Transactions: ${validTransactions.length}`);
console.log(`Total Income:       ${formatCurrency(totalIncome)}`);
console.log(`Total Expenses:     ${formatCurrency(totalExpenses)}`);
console.log(`Remaining Balance:  ${formatCurrency(remainingBalance)}`);
console.log(`Average Expense:    ${formatCurrency(averageExpense)}`);

console.log("\n--- INCOME SUMMARY ---");

if (largestIncome) {
    console.log(`Largest Income: ${largestIncome.title}`);
    console.log(`Amount: ${formatCurrency(largestIncome.amount)}`);
}

console.log("\n--- HIGHEST EXPENSE ---");

if (highestExpense) {
    console.log(`Expense: ${highestExpense.title}`);
    console.log(`Category: ${highestExpense.category}`);
    console.log(`Amount: ${formatCurrency(highestExpense.amount)}`);
}

console.log("\n--- CATEGORY BUDGET REPORT ---");

sortedExpenses.forEach(category => {
    const status = category.exceeded
        ? "OVER BUDGET"
        : "Within Budget";

    console.log(
        `${category.category}: Spent ${formatCurrency(category.spent)} | ` +
        `Budget ${formatCurrency(category.budget)} | ${status}`
    );
});

console.log("\n--- BUDGET ALERTS ---");

if (hasBudgetOverrun) {
    budgetReport
        .filter(category => category.exceeded)
        .forEach(category => {
            console.log(
                `Warning: ${category.category} exceeded its budget by ` +
                `${formatCurrency(category.spent - category.budget)}`
            );
        });
} else {
    console.log("All categories are within their budgets.");
}

console.log("\n--- CATEGORY SEARCH: FOOD ---");

getTransactionsByCategory("Food").forEach(transaction => {
    console.log(
        `${transaction.title}: ${formatCurrency(transaction.amount)}`
    );
});

console.log("\n--- TRANSACTION LOOKUP ---");

const selectedTransaction = findTransaction(5);

if (selectedTransaction) {
    console.log(
        `Found: ${selectedTransaction.title} - ` +
        `${formatCurrency(selectedTransaction.amount)}`
    );
} else {
    console.log("Transaction not found.");
}

console.log("\n--- FINANCIAL HEALTH CHECK ---");
console.log(`All transactions valid: ${allTransactionsValid}`);
console.log(`Any budget exceeded: ${hasBudgetOverrun}`);
console.log(`All budgets under control: ${isBudgetUnderControl}`);

console.log("\n========================================");
console.log("       FINANCIAL REPORT COMPLETE");
console.log("========================================");

/*
OUTPUT

========================================
       PERSONAL FINANCE ANALYZER
========================================
Valid Transactions: 10
Total Income:       Rs. 57,000
Total Expenses:     Rs. 24,700
Remaining Balance:  Rs. 32,300
Average Expense:    Rs. 3,087.5

--- INCOME SUMMARY ---
Largest Income: Monthly Salary
Amount: Rs. 45,000

--- HIGHEST EXPENSE ---
Expense: Clothing
Category: Shopping
Amount: Rs. 7,200

--- CATEGORY BUDGET REPORT ---
Shopping: Spent Rs. 7,200 | Budget Rs. 6,000 | OVER BUDGET
Food: Spent Rs. 5,300 | Budget Rs. 8,000 | Within Budget
Education: Spent Rs. 4,500 | Budget Rs. 10,000 | Within Budget
Bills: Spent Rs. 4,400 | Budget Rs. 5,000 | Within Budget
Transport: Spent Rs. 1,800 | Budget Rs. 4,000 | Within Budget
Entertainment: Spent Rs. 1,500 | Budget Rs. 3,000 | Within Budget

--- BUDGET ALERTS ---
Warning: Shopping exceeded its budget by Rs. 1,200

--- CATEGORY SEARCH: FOOD ---
Grocery Shopping: Rs. 3,200
Restaurant: Rs. 2,100

--- TRANSACTION LOOKUP ---
Found: Programming Course - Rs. 4,500

--- FINANCIAL HEALTH CHECK ---
All transactions valid: true
Any budget exceeded: true
All budgets under control: false

========================================
       FINANCIAL REPORT COMPLETE
========================================

[Done] exited with code=0 in 0.308 seconds


*/