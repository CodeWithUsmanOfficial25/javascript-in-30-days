
// Day 7: Service Booking Manager
// Level: Beginner
// Concepts: The this Keyword, Object Methods, call(), apply(),
// bind(), and Function Context.

// 1. CREATE A SERVICE OBJECT
// An object can store both data (properties) and behaviour (methods).
// Inside a regular object method, 'this' refers to the object
// used to call that method.

const service = {
    customer: "Usman",
    serviceName: "Laptop Repair",
    price: 3500,

    showBooking: function () {
        console.log("Customer:", this.customer);
        console.log("Service:", this.serviceName);
        console.log("Price: Rs.", this.price);
    }
};

console.log("--- SERVICE BOOKING ---");
service.showBooking();


// 2. USE 'this' TO CALCULATE A DISCOUNT
// 'this.price' accesses the price belonging to the calling object.
// The method can calculate a discount using that object's data.

const discountService = {
    customer: "Ali",
    serviceName: "Mobile Repair",
    price: 2000,
    discountPercent: 10,

    calculateFinalPrice: function () {
        const discount = this.price * this.discountPercent / 100;
        return this.price - discount;
    }
};

console.log("\n--- DISCOUNT CALCULATION ---");
console.log(
    "Final price: Rs.",
    discountService.calculateFinalPrice()
);


// 3. REUSE A METHOD WITH ANOTHER OBJECT
// Both objects have the properties required by showBooking().
// We can borrow the method instead of writing it again.

const anotherBooking = {
    customer: "Sara",
    serviceName: "Software Installation",
    price: 1500
};

console.log("\n--- BORROWED METHOD ---");
service.showBooking.call(anotherBooking);

// call() runs the function immediately.
// Its first argument becomes the function's 'this' value.


// 4. USE apply()
// apply() works like call(), but passes function arguments
// as an array. Here, the method accepts a tax percentage.

const billing = {
    calculateBill: function (taxPercent, serviceCharge) {
        const tax = this.price * taxPercent / 100;
        return this.price + tax + serviceCharge;
    }
};

const bookingBill = {
    price: 3000
};

console.log("\n--- BILL WITH TAX ---");
console.log(
    "Total bill: Rs.",
    billing.calculateBill.apply(bookingBill, [5, 200])
);

// The total is 3000 + 150 tax + 200 service charge = 3350.


// 5. USE bind()
// bind() creates a new function with 'this' permanently set
// to the object we provide. It does not run the function immediately.

const customerAccount = {
    customer: "Muzamil",
    balance: 5000,

    showBalance: function () {
        console.log(this.customer + "'s balance: Rs. " + this.balance);
    }
};

const showMuzamilBalance = customerAccount.showBalance.bind(customerAccount);

console.log("\n--- BOUND METHOD ---");
showMuzamilBalance();

// The saved function still uses customerAccount as 'this'.


// 6. COMPARE TWO OBJECTS USING THE SAME METHOD
// The same method can work with different objects when each object
// provides the properties that the method needs.

const secondAccount = {
    customer: "Ahmed",
    balance: 8200,

    showBalance: customerAccount.showBalance
};

console.log("\n--- SHARED METHOD ---");
customerAccount.showBalance();
secondAccount.showBalance();

/*
EXPECTED OUTPUT

--- SERVICE BOOKING ---
Customer: Usman
Service: Laptop Repair
Price: Rs. 3500

--- DISCOUNT CALCULATION ---
Final price: Rs. 1800

--- BORROWED METHOD ---
Customer: Sara
Service: Software Installation
Price: Rs. 1500

--- BILL WITH TAX ---
Total bill: Rs. 3350

--- BOUND METHOD ---
Muzamil's balance: Rs. 5000

--- SHARED METHOD ---
Muzamil's balance: Rs. 5000
Ahmed's balance: Rs. 8200
*/