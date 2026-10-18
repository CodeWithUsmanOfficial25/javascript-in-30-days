
 // Day 11: Product Inventory Search & Sort System
 // Level: Intermediate
 // Concepts: Array Sorting, sort(), toSorted(), Comparison Functions,
 // filter(), map(), find(), and Data Transformation.

// 1. PRODUCT DATA
// Each object represents a product in an online store.
const products = [
    { id: 101, name: "Keyboard", price: 2500, stock: 12, category: "Accessories" },
    { id: 102, name: "Mouse", price: 1200, stock: 4, category: "Accessories" },
    { id: 103, name: "Monitor", price: 32000, stock: 7, category: "Electronics" },
    { id: 104, name: "Headphones", price: 4500, stock: 2, category: "Accessories" },
    { id: 105, name: "Laptop", price: 125000, stock: 5, category: "Electronics" }
];

console.log("===== PRODUCT INVENTORY =====");
console.table(products);


// 2. SORT PRODUCTS BY PRICE
// sort() changes the original array.
// The comparison function determines the order.
// Returning a negative number puts a before b;
// a positive number puts b before a.
const productsByPrice = [...products].sort((a, b) => a.price - b.price);

console.log("\n===== PRICE: LOW TO HIGH =====");
console.table(productsByPrice);


// 3. SORT FROM HIGHEST TO LOWEST
// Reverse the subtraction to sort in descending order.
// We copy the array first to protect the original data.
const expensiveProducts = [...products].sort((a, b) => b.price - a.price);

console.log("\n===== PRICE: HIGH TO LOW =====");
console.table(expensiveProducts);


// 4. FIND A SPECIFIC PRODUCT
// find() returns the first matching object or undefined.
// toLowerCase() makes the search case-insensitive.
const searchName = "monitor";

const searchedProduct = products.find(
    product => product.name.toLowerCase() === searchName.toLowerCase()
);

console.log("\n===== PRODUCT SEARCH =====");

if (searchedProduct) {
    console.log("Found product:", searchedProduct.name);
    console.log("Price:", searchedProduct.price);
    console.log("Stock:", searchedProduct.stock);
} else {
    console.log("Product not found.");
}


// 5. FILTER LOW-STOCK PRODUCTS
// filter() returns a new array containing all matching products.
// Here, low stock means fewer than 5 units remain.
const lowStockProducts = products.filter(
    product => product.stock < 5
);

console.log("\n===== LOW-STOCK ALERT =====");
console.table(lowStockProducts);


// 6. CREATE A SIMPLE PRICE LIST
// map() transforms each product into a simpler display object.
// The original product objects are not changed.
const priceList = products.map(product => ({
    Product: product.name,
    "Price (PKR)": product.price
}));

console.log("\n===== PRODUCT PRICE LIST =====");
console.table(priceList);


// 7. GET THE TOTAL VALUE OF INVENTORY
// reduce() combines all products into one total.
// Each product contributes price multiplied by available stock.
const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
);

console.log("\n===== INVENTORY SUMMARY =====");
console.log("Total product types:", products.length);
console.log("Total inventory value: PKR", inventoryValue);


/*
 OUTPUT
 
===== PRODUCT INVENTORY =====
┌─────────┬─────┬──────────────┬────────┬───────┬───────────────┐
│ (index) │ id  │ name         │ price  │ stock │ category      │
├─────────┼─────┼──────────────┼────────┼───────┼───────────────┤
│ 0       │ 101 │ 'Keyboard'   │ 2500   │ 12    │ 'Accessories' │
│ 1       │ 102 │ 'Mouse'      │ 1200   │ 4     │ 'Accessories' │
│ 2       │ 103 │ 'Monitor'    │ 32000  │ 7     │ 'Electronics' │
│ 3       │ 104 │ 'Headphones' │ 4500   │ 2     │ 'Accessories' │
│ 4       │ 105 │ 'Laptop'     │ 125000 │ 5     │ 'Electronics' │
└─────────┴─────┴──────────────┴────────┴───────┴───────────────┘

===== PRICE: LOW TO HIGH =====
┌─────────┬─────┬──────────────┬────────┬───────┬───────────────┐
│ (index) │ id  │ name         │ price  │ stock │ category      │
├─────────┼─────┼──────────────┼────────┼───────┼───────────────┤
│ 0       │ 102 │ 'Mouse'      │ 1200   │ 4     │ 'Accessories' │
│ 1       │ 101 │ 'Keyboard'   │ 2500   │ 12    │ 'Accessories' │
│ 2       │ 104 │ 'Headphones' │ 4500   │ 2     │ 'Accessories' │
│ 3       │ 103 │ 'Monitor'    │ 32000  │ 7     │ 'Electronics' │
│ 4       │ 105 │ 'Laptop'     │ 125000 │ 5     │ 'Electronics' │
└─────────┴─────┴──────────────┴────────┴───────┴───────────────┘

===== PRICE: HIGH TO LOW =====
┌─────────┬─────┬──────────────┬────────┬───────┬───────────────┐
│ (index) │ id  │ name         │ price  │ stock │ category      │
├─────────┼─────┼──────────────┼────────┼───────┼───────────────┤
│ 0       │ 105 │ 'Laptop'     │ 125000 │ 5     │ 'Electronics' │
│ 1       │ 103 │ 'Monitor'    │ 32000  │ 7     │ 'Electronics' │
│ 2       │ 104 │ 'Headphones' │ 4500   │ 2     │ 'Accessories' │
│ 3       │ 101 │ 'Keyboard'   │ 2500   │ 12    │ 'Accessories' │
│ 4       │ 102 │ 'Mouse'      │ 1200   │ 4     │ 'Accessories' │
└─────────┴─────┴──────────────┴────────┴───────┴───────────────┘

===== PRODUCT SEARCH =====
Found product: Monitor
Price: 32000
Stock: 7

===== LOW-STOCK ALERT =====
┌─────────┬─────┬──────────────┬───────┬───────┬───────────────┐
│ (index) │ id  │ name         │ price │ stock │ category      │
├─────────┼─────┼──────────────┼───────┼───────┼───────────────┤
│ 0       │ 102 │ 'Mouse'      │ 1200  │ 4     │ 'Accessories' │
│ 1       │ 104 │ 'Headphones' │ 4500  │ 2     │ 'Accessories' │
└─────────┴─────┴──────────────┴───────┴───────┴───────────────┘

===== PRODUCT PRICE LIST =====
┌─────────┬──────────────┬─────────────┐
│ (index) │ Product      │ Price (PKR) │
├─────────┼──────────────┼─────────────┤
│ 0       │ 'Keyboard'   │ 2500        │
│ 1       │ 'Mouse'      │ 1200        │
│ 2       │ 'Monitor'    │ 32000       │
│ 3       │ 'Headphones' │ 4500        │
│ 4       │ 'Laptop'     │ 125000      │
└─────────┴──────────────┴─────────────┘

===== INVENTORY SUMMARY =====
Total product types: 5
Total inventory value: PKR 892800

[Done] exited with code=0 in 0.129 seconds


*/