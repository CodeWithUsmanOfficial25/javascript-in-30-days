
// Day 10: Reusable Product Management System
// Level: Beginner to Intermediate
// Concepts: Constructor Functions, The new Keyword, Prototypes,
// Object Instances, Shared Methods, and instanceof.

// 1. CREATE A CONSTRUCTOR FUNCTION
// A constructor function defines the properties that each product needs.
// The "new" keyword creates a new object and sets "this" to that object.
function Product(name, price, category, stock) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
}

// 2. ADD A SHARED METHOD TO THE PROTOTYPE
// Methods added to the prototype are shared by all Product instances.
// This avoids creating a separate copy of the method for every product.
Product.prototype.displayDetails = function () {
    console.log("Product:", this.name);
    console.log("Price: Rs.", this.price);
    console.log("Category:", this.category);
    console.log("Stock:", this.stock);
};

// 3. ADD ANOTHER SHARED METHOD
// "this" refers to the particular product calling the method.
Product.prototype.applyDiscount = function (discountPercent) {
    if (discountPercent < 0 || discountPercent > 100) {
        return "Invalid discount percentage.";
    }

    const discount = this.price * discountPercent / 100;
    this.price = this.price - discount;

    return "Discount applied: " + discountPercent + "%";
};

// 4. CREATE OBJECT INSTANCES
// Each use of "new Product()" creates an independent product object.
const laptop = new Product("Laptop", 150000, "Electronics", 5);
const headphones = new Product("Headphones", 5000, "Accessories", 12);
const keyboard = new Product("Keyboard", 3500, "Accessories", 8);

// 5. DISPLAY PRODUCT DETAILS
console.log("--- PRODUCT DETAILS ---");
laptop.displayDetails();

console.log("\n--- APPLY DISCOUNT ---");
console.log(headphones.applyDiscount(10));
headphones.displayDetails();

// The discount changes the headphones object, not the laptop.
console.log("\n--- CHECK INDEPENDENT OBJECTS ---");
console.log("Laptop price:", laptop.price);
console.log("Headphones price:", headphones.price);

// 6. CHECK PROTOTYPE METHOD SHARING
// Both objects use the same method stored on Product.prototype.
console.log("\n--- PROTOTYPE CHECK ---");
console.log(
    "Laptop uses shared method:",
    laptop.displayDetails === headphones.displayDetails
);

// 7. CHECK OBJECT TYPES WITH INSTANCEOF
// instanceof checks whether an object was created using a constructor's
// prototype chain.
console.log("\n--- INSTANCE CHECK ---");
console.log("Laptop is a Product:", laptop instanceof Product);
console.log("Keyboard is a Product:", keyboard instanceof Product);
console.log("Laptop is an Array:", laptop instanceof Array);

// 8. LIST ALL PRODUCTS
// An array lets us manage and process multiple product objects together.
const products = [laptop, headphones, keyboard];

console.log("\n--- PRODUCT CATALOG ---");

for (const product of products) {
    console.log(product.name + " - Rs. " + product.price);
}

/*
 OUTPUT

--- PRODUCT DETAILS ---
Product: Laptop
Price: Rs. 150000
Category: Electronics
Stock: 5

--- APPLY DISCOUNT ---
Discount applied: 10%
Product: Headphones
Price: Rs. 4500
Category: Accessories
Stock: 12

--- CHECK INDEPENDENT OBJECTS ---
Laptop price: 150000
Headphones price: 4500

--- PROTOTYPE CHECK ---
Laptop uses shared method: true

--- INSTANCE CHECK ---
Laptop is a Product: true
Keyboard is a Product: true
Laptop is an Array: false

--- PRODUCT CATALOG ---
Laptop - Rs. 150000
Headphones - Rs. 4500
Keyboard - Rs. 3500

*/
