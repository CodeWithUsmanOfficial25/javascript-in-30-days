
const orders = [
    {
        id: 1001,
        customer: "Ali Khan",
        items: [
            { name: "Keyboard", price: 2500, quantity: 1 },
            { name: "Mouse", price: 1200, quantity: 2 },
        ],
        status: "delivered",
    },
    {
        id: 1002,
        customer: "Sara Ahmed",
        items: [
            { name: "Headphones", price: 3500, quantity: 1 },
        ],
        status: "processing",
    },
    {
        id: 1003,
        customer: "Usman Malik",
        items: [
            { name: "Monitor", price: 28000, quantity: 1 },
            { name: "HDMI Cable", price: 800, quantity: 2 },
        ],
        status: "shipped",
    },
    {
        id: 1004,
        customer: "Ayesha Noor",
        items: [
            { name: "Webcam", price: 4500, quantity: 1 },
            { name: "Headphones", price: 3500, quantity: 1 },
        ],
        status: "delivered",
    },
    {
        id: 1005,
        customer: "Hamza Ali",
        items: [
            { name: "USB Drive", price: 1500, quantity: 3 },
        ],
        status: "cancelled",
    },
];

// Validate orders before including them in reports.
function isValidOrder(order) {
    return (
        Number.isInteger(order.id) &&
        typeof order.customer === "string" &&
        order.customer.trim() !== "" &&
        Array.isArray(order.items) &&
        order.items.length > 0 &&
        order.items.every((item) =>
            typeof item.name === "string" &&
            item.name.trim() !== "" &&
            Number.isFinite(item.price) &&
            item.price > 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        ) &&
        ["processing", "shipped", "delivered", "cancelled"].includes(
            order.status
        )
    );
}

// Calculate the total value of one order.
function calculateOrderTotal(order) {
    return order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

const validOrders = orders.filter(isValidOrder);
const invalidOrderCount = orders.length - validOrders.length;

// Add a calculated total to each valid order without changing the original.
const orderSummaries = validOrders.map((order) => ({
    id: order.id,
    customer: order.customer,
    status: order.status,
    total: calculateOrderTotal(order),
}));

// Build reports for each order status.
const deliveredOrders = orderSummaries.filter(
    (order) => order.status === "delivered"
);

const processingOrders = orderSummaries.filter(
    (order) => order.status === "processing"
);

const shippedOrders = orderSummaries.filter(
    (order) => order.status === "shipped"
);

const cancelledOrders = orderSummaries.filter(
    (order) => order.status === "cancelled"
);

// Count revenue from delivered orders only.
const deliveredRevenue = deliveredOrders.reduce(
    (total, order) => total + order.total,
    0
);

// Calculate the value of orders that are not cancelled.
const activeOrderValue = orderSummaries
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);

// Find the highest-value order.
const highestValueOrder = orderSummaries.reduce((highest, current) =>
    current.total > highest.total ? current : highest
);

// Check useful conditions for the report.
const hasPendingOrders = validOrders.some(
    (order) => order.status === "processing"
);

const allOrdersValid = validOrders.length === orders.length;

// Sort a copy of the summaries by order value, highest first.
const ordersByValue = [...orderSummaries].sort(
    (a, b) => b.total - a.total
);

// Display the order management report.
const formatRupees = (amount) => `Rs. ${amount.toLocaleString("en-PK")}`;

console.log("===== E-COMMERCE ORDER MANAGEMENT SYSTEM =====");

console.log("\n--- Overview ---");
console.log(`Total orders: ${orders.length}`);
console.log(`Valid orders: ${validOrders.length}`);
console.log(`Invalid orders: ${invalidOrderCount}`);
console.log(`Delivered: ${deliveredOrders.length}`);
console.log(`Processing: ${processingOrders.length}`);
console.log(`Shipped: ${shippedOrders.length}`);
console.log(`Cancelled: ${cancelledOrders.length}`);

console.log("\n--- Financial Summary ---");
console.log(`Delivered revenue: ${formatRupees(deliveredRevenue)}`);
console.log(`Active order value: ${formatRupees(activeOrderValue)}`);

console.log("\n--- Highest-Value Order ---");
console.log(
    `${highestValueOrder.customer} — ${formatRupees(highestValueOrder.total)}`
);

console.log("\n--- Orders Sorted by Value ---");
console.table(
    ordersByValue.map((order) => ({
        ...order,
        total: formatRupees(order.total),
    }))
);

console.log(`Any orders awaiting processing? ${hasPendingOrders ? "Yes" : "No"}`);
console.log(`Are all orders valid? ${allOrdersValid ? "Yes" : "No"}`);

/*
OUTPUT

===== E-COMMERCE ORDER MANAGEMENT SYSTEM =====

--- Overview ---
Total orders: 5
Valid orders: 5
Invalid orders: 0
Delivered: 2
Processing: 1
Shipped: 1
Cancelled: 1

--- Financial Summary ---
Delivered revenue: Rs. 12,900
Active order value: Rs. 46,000

--- Highest-Value Order ---
Usman Malik — Rs. 29,600

--- Orders Sorted by Value ---
┌─────────┬──────┬───────────────┬──────────────┬──────────────┐
│ (index) │ id   │ customer      │ status       │ total        │
├─────────┼──────┼───────────────┼──────────────┼──────────────┤
│ 0       │ 1003 │ 'Usman Malik' │ 'shipped'    │ 'Rs. 29,600' │
│ 1       │ 1004 │ 'Ayesha Noor' │ 'delivered'  │ 'Rs. 8,000'  │
│ 2       │ 1001 │ 'Ali Khan'    │ 'delivered'  │ 'Rs. 4,900'  │
│ 3       │ 1005 │ 'Hamza Ali'   │ 'cancelled'  │ 'Rs. 4,500'  │
│ 4       │ 1002 │ 'Sara Ahmed'  │ 'processing' │ 'Rs. 3,500'  │
└─────────┴──────┴───────────────┴──────────────┴──────────────┘
Any orders awaiting processing? Yes
Are all orders valid? Yes

[Done] exited with code=0 in 0.381 seconds

*/