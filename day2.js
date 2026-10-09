// const declares a variable that cannot be reassigned to a different value.
const productName = "Wireless Headphones";
const priceInput = "5000";
const quantity = 2;
const discountPercent = 10;
const freeShippingLimit = 8000;

// Number() converts the string "5000" into the number 5000.
// This is an example of explicit datatype conversion.
const unitPrice = Number(priceInput);

// The multiplication operator (*) calculates the subtotal.
const subtotal = unitPrice * quantity;

// Arithmetic operators calculate the discount amount.
// Division (/) converts the percentage into a fraction.
const discountAmount = subtotal * discountPercent / 100;

// The subtraction operator (-) deducts the discount from the subtotal.
const finalPrice = subtotal - discountAmount;

// The >= comparison operator checks whether the final price
// meets or exceeds the free-shipping limit.
// The result is a boolean: true or false.
const freeShippingEligible = finalPrice >= freeShippingLimit;

// Primitive values such as numbers are copied by value.
// originalSubtotal receives a copy of subtotal.
const originalSubtotal = subtotal;
let copiedSubtotal = originalSubtotal;

// let allows reassignment, so copiedSubtotal can receive a new value.
// Changing this variable does not change originalSubtotal.
copiedSubtotal = 12000;

// console.log() displays messages and variable values in the console.
console.log(" SHOPPING CART SUMMARY ");
console.log("Product Name:", productName);
console.log("Unit Price:", unitPrice);
console.log("Quantity:", quantity);
console.log("Subtotal:", subtotal);
console.log("Discount:", discountAmount);
console.log("Final Price:", finalPrice);
console.log("Free Shipping Eligible:", freeShippingEligible);

// \n adds a line break before the next heading.
console.log("\n VALUE COPYING ");
console.log("Original Subtotal:", originalSubtotal);
console.log("Copied Subtotal:", copiedSubtotal);