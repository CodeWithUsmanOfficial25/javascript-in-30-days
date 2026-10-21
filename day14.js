
/*
Day 14: Secure Payment Processing System
Level: Intermediate

Concepts:
1. try...catch...finally
2. throw and Error objects
3. Custom error classes
4. Input validation
5. Defensive programming
6. Handling failed transactions
*/

// 1. CREATE A CUSTOM ERROR CLASS
// Custom errors let us describe specific problems clearly.
class PaymentError extends Error {
    constructor(message) {
        super(message);
        this.name = "PaymentError";
    }
}

// 2. CREATE THE PAYMENT PROCESSOR
function processPayment(account, amount) {
    try {
        // Validate the account before processing a payment.
        if (!account || typeof account !== "object") {
            throw new PaymentError("Invalid account details.");
        }

        if (typeof account.balance !== "number" ||
            !Number.isFinite(account.balance) ||
            account.balance < 0) {
            throw new PaymentError("Invalid account balance.");
        }

        // A payment must be a positive, finite number.
        if (typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0) {
            throw new PaymentError("Payment amount must be positive.");
        }

        // Reject payments when the account has insufficient funds.
        if (amount > account.balance) {
            throw new PaymentError("Insufficient account balance.");
        }

        // Update the account only after all validations pass.
        account.balance -= amount;

        console.log("Payment successful!");
        console.log("Amount paid: PKR", amount);
        console.log("Remaining balance: PKR", account.balance);

        return true;

    } catch (error) {
        // Handle expected payment errors separately from other errors.
        if (error instanceof PaymentError) {
            console.log("Payment failed:", error.message);
        } else {
            console.log("Unexpected error:", error.message);
        }

        return false;

    } finally {
        // finally runs whether the payment succeeds or fails.
        console.log("Payment process completed.");
    }
}

// 3. CREATE A CUSTOMER ACCOUNT
const customer = {
    name: "Usman",
    balance: 50000
};

// 4. TEST A SUCCESSFUL PAYMENT
console.log("--- TRANSACTION 1 ---");
processPayment(customer, 12000);

// 5. TEST INSUFFICIENT FUNDS
console.log("\n--- TRANSACTION 2 ---");
processPayment(customer, 45000);

// 6. TEST INVALID INPUT
console.log("\n--- TRANSACTION 3 ---");
processPayment(customer, -500);

// 7. DISPLAY THE FINAL ACCOUNT BALANCE
console.log("\n--- ACCOUNT SUMMARY ---");
console.log("Customer:", customer.name);
console.log("Final balance: PKR", customer.balance);

/*
 OUTPUT

--- TRANSACTION 1 ---
Payment successful!
Amount paid: PKR 12000
Remaining balance: PKR 38000
Payment process completed.

--- TRANSACTION 2 ---
Payment failed: Insufficient account balance.
Payment process completed.

--- TRANSACTION 3 ---
Payment failed: Payment amount must be positive.
Payment process completed.

--- ACCOUNT SUMMARY ---
Customer: Usman
Final balance: PKR 38000

*/
