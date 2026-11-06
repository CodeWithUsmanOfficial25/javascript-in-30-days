
const EventEmitter = require("node:events");

class OrderError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderError";
  }
}

class ECommerceEngine extends EventEmitter {
  #products = new Map();
  #orders = new Map();
  #coupons = new Map([
    ["SAVE10", 10],
    ["WELCOME15", 15]
  ]);
  #nextOrderId = 1001;

  constructor() {
    super();

    this.#addProduct("P101", "Wireless Mouse", 2500, 10);
    this.#addProduct("P102", "Mechanical Keyboard", 6500, 5);
    this.#addProduct("P103", "USB-C Hub", 3200, 8);
    this.#addProduct("P104", "Laptop Stand", 1800, 3);
  }

  #addProduct(id, name, price, stock) {
    this.#products.set(id, {
      id,
      name,
      price,
      stock
    });
  }

  createOrder(customer, items, coupon = null, paymentMethod = "card") {
    if (typeof customer !== "string" || !customer.trim()) {
      throw new OrderError("A valid customer name is required.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new OrderError("An order must contain at least one item.");
    }

    if (typeof paymentMethod !== "string" || !paymentMethod.trim()) {
      throw new OrderError("A valid payment method is required.");
    }

    const orderItems = items.map(item => {
      if (!item || !Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new OrderError("Each item must have a valid quantity.");
      }

      const product = this.#products.get(item.productId);

      if (!product) {
        throw new OrderError(`Product ${item.productId} does not exist.`);
      }

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      };
    });

    if (coupon && !this.#coupons.has(coupon)) {
      throw new OrderError(`Coupon "${coupon}" is not valid.`);
    }

    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const discountRate = coupon ? this.#coupons.get(coupon) : 0;
    const discount = Number((subtotal * discountRate / 100).toFixed(2));
    const total = Number((subtotal - discount).toFixed(2));

    const order = {
      id: this.#nextOrderId++,
      customer: customer.trim(),
      items: orderItems,
      subtotal,
      discount,
      total,
      coupon,
      paymentMethod: paymentMethod.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    this.#orders.set(order.id, order);

    this.emit("orderCreated", {
      id: order.id,
      customer: order.customer,
      total: order.total
    });

    return order.id;
  }

  async #processPayment(order) {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (order.paymentMethod === "card-0000") {
      throw new OrderError("Payment was declined by the bank.");
    }

    return {
      transactionId: `TXN-${order.id}`,
      amount: order.total,
      status: "paid"
    };
  }

  async processOrder(orderId) {
    const order = this.#orders.get(orderId);

    if (!order) {
      throw new OrderError(`Order ${orderId} was not found.`);
    }

    if (order.status !== "pending") {
      throw new OrderError("This order has already been processed.");
    }

    order.status = "processing";

    try {
      for (const item of order.items) {
        const product = this.#products.get(item.productId);

        if (!product || product.stock < item.quantity) {
          throw new OrderError(`Insufficient stock for ${item.name}.`);
        }
      }

      const payment = await this.#processPayment(order);

      for (const item of order.items) {
        const product = this.#products.get(item.productId);
        product.stock -= item.quantity;
      }

      order.payment = payment;
      order.status = "completed";
      order.completedAt = new Date().toISOString();

      this.emit("orderCompleted", {
        id: order.id,
        customer: order.customer,
        total: order.total
      });

    } catch (error) {
      order.status = "failed";
      order.error = error.message;

      this.emit("orderFailed", {
        id: order.id,
        customer: order.customer,
        reason: error.message
      });
    }

    return this.getOrder(orderId);
  }

  async processAllOrders() {
    for (const orderId of this.#orders.keys()) {
      const order = this.#orders.get(orderId);

      if (order.status === "pending") {
        await this.processOrder(orderId);
      }
    }

    return this.getSalesReport();
  }

  getOrder(orderId) {
    const order = this.#orders.get(orderId);

    if (!order) {
      throw new OrderError(`Order ${orderId} was not found.`);
    }

    return {
      ...order,
      items: order.items.map(item => ({ ...item })),
      payment: order.payment ? { ...order.payment } : null
    };
  }

  getProducts() {
    return [...this.#products.values()].map(product => ({
      ...product
    }));
  }

  getSalesReport() {
    const orders = [...this.#orders.values()];

    const completed = orders.filter(
      order => order.status === "completed"
    );

    const failed = orders.filter(
      order => order.status === "failed"
    );

    const revenue = completed.reduce(
      (total, order) => total + order.total,
      0
    );

    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      failedOrders: failed.length,
      pendingOrders: orders.filter(
        order => order.status === "pending"
      ).length,
      totalRevenue: Number(revenue.toFixed(2)),
      averageOrderValue: completed.length
        ? Number((revenue / completed.length).toFixed(2))
        : 0
    };
  }

  *completedOrders() {
    for (const order of this.#orders.values()) {
      if (order.status === "completed") {
        yield this.getOrder(order.id);
      }
    }
  }

  [Symbol.iterator]() {
    return this.#orders.values();
  }
}

const store = new ECommerceEngine();

store.on("orderCreated", order => {
  console.log(
    `Order #${order.id} created for ${order.customer}.`
  );
});

store.on("orderCompleted", order => {
  console.log(
    `Order #${order.id} completed. Total: Rs. ${order.total}`
  );
});

store.on("orderFailed", order => {
  console.log(
    `Order #${order.id} failed: ${order.reason}`
  );
});

async function runStoreDemo() {
  try {
    console.log("\n--- Available Products ---");
    console.table(store.getProducts());

    console.log("\n--- Creating Orders ---");

    const order1 = store.createOrder(
      "Usman",
      [
        { productId: "P101", quantity: 1 },
        { productId: "P103", quantity: 2 }
      ],
      "SAVE10"
    );

    const order2 = store.createOrder(
      "Ali",
      [
        { productId: "P102", quantity: 1 }
      ],
      null,
      "card-0000"
    );

    const order3 = store.createOrder(
      "Ahmed",
      [
        { productId: "P104", quantity: 10 }
      ]
    );

    console.log("\n--- Processing Orders ---");

    await store.processAllOrders();

    console.log("\n--- Order Details ---");

    console.dir(store.getOrder(order1), { depth: null });
    console.dir(store.getOrder(order2), { depth: null });
    console.dir(store.getOrder(order3), { depth: null });

    console.log("\n--- Completed Orders ---");

    for (const order of store.completedOrders()) {
      console.log(
        `#${order.id} | ${order.customer} | Rs. ${order.total}`
      );
    }

    console.log("\n--- Sales Report ---");
    console.table(store.getSalesReport());

    console.log("\n--- Remaining Stock ---");
    console.table(store.getProducts());

  } catch (error) {
    console.error("Store Error:", error.message);
  }
}

runStoreDemo();


/*
[Running] node "f:\javascript-in-30-days\day30.js"

--- Available Products ---
┌─────────┬────────┬───────────────────────┬───────┬───────┐
│ (index) │ id     │ name                  │ price │ stock │
├─────────┼────────┼───────────────────────┼───────┼───────┤
│ 0       │ 'P101' │ 'Wireless Mouse'      │ 2500  │ 10    │
│ 1       │ 'P102' │ 'Mechanical Keyboard' │ 6500  │ 5     │
│ 2       │ 'P103' │ 'USB-C Hub'           │ 3200  │ 8     │
│ 3       │ 'P104' │ 'Laptop Stand'        │ 1800  │ 3     │
└─────────┴────────┴───────────────────────┴───────┴───────┘

--- Creating Orders ---
New order #1001 received from Usman.
New order #1002 received from Ali.
Store Error: Not enough stock for Laptop Stand.

[Done] exited with code=0 in 0.514 seconds

[Running] node "f:\javascript-in-30-days\day30.js"

--- Available Products ---
┌─────────┬────────┬───────────────────────┬───────┬───────┐
│ (index) │ id     │ name                  │ price │ stock │
├─────────┼────────┼───────────────────────┼───────┼───────┤
│ 0       │ 'P101' │ 'Wireless Mouse'      │ 2500  │ 10    │
│ 1       │ 'P102' │ 'Mechanical Keyboard' │ 6500  │ 5     │
│ 2       │ 'P103' │ 'USB-C Hub'           │ 3200  │ 8     │
│ 3       │ 'P104' │ 'Laptop Stand'        │ 1800  │ 3     │
└─────────┴────────┴───────────────────────┴───────┴───────┘

--- Creating Orders ---
Order #1001 created for Usman.
Order #1002 created for Ali.
Order #1003 created for Ahmed.

--- Processing Orders ---
Order #1001 completed. Total: Rs. 8010
Order #1002 failed: Payment was declined by the bank.
Order #1003 failed: Insufficient stock for Laptop Stand.

--- Order Details ---
{
  id: 1001,
  customer: 'Usman',
  items: [
    {
      productId: 'P101',
      name: 'Wireless Mouse',
      price: 2500,
      quantity: 1
    },
    { productId: 'P103', name: 'USB-C Hub', price: 3200, quantity: 2 }
  ],
  subtotal: 8900,
  discount: 890,
  total: 8010,
  coupon: 'SAVE10',
  paymentMethod: 'card',
  status: 'completed',
  createdAt: '2026-11-06T13:04:36.618Z',
  payment: { transactionId: 'TXN-1001', amount: 8010, status: 'paid' },
  completedAt: '2026-11-06T13:04:37.058Z'
}
{
  id: 1002,
  customer: 'Ali',
  items: [
    {
      productId: 'P102',
      name: 'Mechanical Keyboard',
      price: 6500,
      quantity: 1
    }
  ],
  subtotal: 6500,
  discount: 0,
  total: 6500,
  coupon: null,
  paymentMethod: 'card-0000',
  status: 'failed',
  createdAt: '2026-11-06T13:04:36.644Z',
  error: 'Payment was declined by the bank.',
  payment: null
}
{
  id: 1003,
  customer: 'Ahmed',
  items: [
    {
      productId: 'P104',
      name: 'Laptop Stand',
      price: 1800,
      quantity: 10
    }
  ],
  subtotal: 18000,
  discount: 0,
  total: 18000,
  coupon: null,
  paymentMethod: 'card',
  status: 'failed',
  createdAt: '2026-11-06T13:04:36.644Z',
  error: 'Insufficient stock for Laptop Stand.',
  payment: null
}

--- Completed Orders ---
#1001 | Usman | Rs. 8010

--- Sales Report ---
┌───────────────────┬────────┐
│ (index)           │ Values │
├───────────────────┼────────┤
│ totalOrders       │ 3      │
│ completedOrders   │ 1      │
│ failedOrders      │ 2      │
│ pendingOrders     │ 0      │
│ totalRevenue      │ 8010   │
│ averageOrderValue │ 8010   │
└───────────────────┴────────┘

--- Remaining Stock ---
┌─────────┬────────┬───────────────────────┬───────┬───────┐
│ (index) │ id     │ name                  │ price │ stock │
├─────────┼────────┼───────────────────────┼───────┼───────┤
│ 0       │ 'P101' │ 'Wireless Mouse'      │ 2500  │ 9     │
│ 1       │ 'P102' │ 'Mechanical Keyboard' │ 6500  │ 5     │
│ 2       │ 'P103' │ 'USB-C Hub'           │ 3200  │ 6     │
│ 3       │ 'P104' │ 'Laptop Stand'        │ 1800  │ 3     │
└─────────┴────────┴───────────────────────┴───────┴───────┘

[Done] exited with code=0 in 1.16 seconds

*/