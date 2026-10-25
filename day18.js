
const transactions = [
    { id: 101, type: "deposit", amount: 5000, description: "Salary" },
    { id: 102, type: "withdrawal", amount: 1200, description: "Groceries" },
    { id: 103, type: "deposit", amount: 2500, description: "Freelance work" },
    { id: 104, type: "withdrawal", amount: 800, description: "Internet bill" },
    { id: 105, type: "deposit", amount: 1500, description: "Refund" },
    { id: 106, type: "withdrawal", amount: 600, description: "Transport" },
];

// Validate transaction records before including them in calculations.
const validTransactions = transactions.filter((transaction) => {
    return (
        Number.isInteger(transaction.id) &&
        ["deposit", "withdrawal"].includes(transaction.type) &&
        Number.isFinite(transaction.amount) &&
        transaction.amount > 0 &&
        typeof transaction.description === "string" &&
        transaction.description.trim() !== ""
    );
});

// Separate deposits and withdrawals.
const deposits = validTransactions.filter(
    (transaction) => transaction.type === "deposit"
);

const withdrawals = validTransactions.filter(
    (transaction) => transaction.type === "withdrawal"
);

// Calculate totals with reduce().
const totalDeposits = deposits.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const totalWithdrawals = withdrawals.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const finalBalance = totalDeposits - totalWithdrawals;

// Find the largest transaction.
const largestTransaction = validTransactions.reduce((largest, current) => {
    return current.amount > largest.amount ? current : largest;
});

// Create a readable transaction report using map().
const transactionReport = validTransactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    formattedAmount: `Rs. ${transaction.amount.toLocaleString("en-PK")}`,
}));

// Check whether any transaction exceeds Rs. 4,000.
const hasLargeTransaction = validTransactions.some(
    (transaction) => transaction.amount > 4000
);

// Display the report.
console.log("===== BANK ACCOUNT TRANSACTION ANALYZER =====");
console.log(`Total transactions: ${transactions.length}`);
console.log(`Valid transactions: ${validTransactions.length}`);
console.log(`Rejected transactions: ${transactions.length - validTransactions.length}`);
console.log(`Total deposits: Rs. ${totalDeposits.toLocaleString("en-PK")}`);
console.log(`Total withdrawals: Rs. ${totalWithdrawals.toLocaleString("en-PK")}`);
console.log(`Final balance: Rs. ${finalBalance.toLocaleString("en-PK")}`);

console.log("\nLargest transaction:");
console.log(largestTransaction);

console.log("\nTransaction report:");
console.table(transactionReport);

console.log(
    `Any transaction above Rs. 4,000? ${hasLargeTransaction ? "Yes" : "No"}`
);
/*
===== BANK ACCOUNT TRANSACTION ANALYZER =====
Total transactions: 6
Valid transactions: 6
Rejected transactions: 0
Total deposits: Rs. 9,000
Total withdrawals: Rs. 2,600
Final balance: Rs. 6,400

Largest transaction:
{ id: 101, type: 'deposit', amount: 5000, description: 'Salary' }

Transaction report:
┌─────────┬─────┬──────────────┬────────┬──────────────────┬─────────────────┐
│ (index) │ id  │ type         │ amount │ description      │ formattedAmount │
├─────────┼─────┼──────────────┼────────┼──────────────────┼─────────────────┤
│ 0       │ 101 │ 'deposit'    │ 5000   │ 'Salary'         │ 'Rs. 5,000'     │
│ 1       │ 102 │ 'withdrawal' │ 1200   │ 'Groceries'      │ 'Rs. 1,200'     │
│ 2       │ 103 │ 'deposit'    │ 2500   │ 'Freelance work' │ 'Rs. 2,500'     │
│ 3       │ 104 │ 'withdrawal' │ 800    │ 'Internet bill'  │ 'Rs. 800'       │
│ 4       │ 105 │ 'deposit'    │ 1500   │ 'Refund'         │ 'Rs. 1,500'     │
│ 5       │ 106 │ 'withdrawal' │ 600    │ 'Transport'      │ 'Rs. 600'       │
└─────────┴─────┴──────────────┴────────┴──────────────────┴─────────────────┘
Any transaction above Rs. 4,000? Yes

[Done] exited with code=0 in 0.847 seconds
 */