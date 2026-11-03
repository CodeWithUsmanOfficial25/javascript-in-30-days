
class CacheError extends Error {
  constructor(message) {
    super(message);
    this.name = "CacheError";
  }
}

class APICache {
  #cache = new Map();
  #maxSize;
  #ttl;
  #hits = 0;
  #misses = 0;

  constructor(maxSize = 3, ttl = 5000) {
    if (maxSize < 1 || ttl < 1) {
      throw new CacheError("Cache size aur TTL positive hone chahiye.");
    }

    this.#maxSize = maxSize;
    this.#ttl = ttl;
  }

  set(key, value) {
    if (!key || value === undefined) {
      throw new CacheError("Valid key aur value required hain.");
    }

    // Purani entry update ho rahi ho to usay fresh position milay gi.
    this.#cache.delete(key);

    if (this.#cache.size >= this.#maxSize) {
      const oldestKey = this.#cache.keys().next().value;
      this.#cache.delete(oldestKey);

      console.log(`Cache full tha, "${oldestKey}" remove kar diya.`);
    }

    this.#cache.set(key, {
      value,
      expiresAt: Date.now() + this.#ttl
    });

    console.log(`"${key}" cache mein save ho gaya.`);
  }

  get(key) {
    const entry = this.#cache.get(key);

    if (!entry) {
      this.#misses++;
      console.log(`Cache miss: "${key}"`);
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      this.#cache.delete(key);
      this.#misses++;

      console.log(`"${key}" ki cache expire ho chuki hai.`);
      return null;
    }

    // Access hone wali entry ko end par rakhte hain.
    // Is tarah least recently used entry pehle remove hoti hai.
    this.#cache.delete(key);
    this.#cache.set(key, entry);

    this.#hits++;
    console.log(`Cache hit: "${key}"`);

    return entry.value;
  }

  delete(key) {
    if (!this.#cache.has(key)) {
      return false;
    }

    this.#cache.delete(key);
    console.log(`"${key}" cache se remove ho gaya.`);
    return true;
  }

  clear() {
    this.#cache.clear();
    console.log("Cache clear ho gaya.");
  }

  get size() {
    return this.#cache.size;
  }

  getStats() {
    const totalRequests = this.#hits + this.#misses;

    return {
      hits: this.#hits,
      misses: this.#misses,
      totalRequests,
      hitRate: totalRequests
        ? `${((this.#hits / totalRequests) * 100).toFixed(2)}%`
        : "0%",
      currentSize: this.#cache.size,
      maxSize: this.#maxSize
    };
  }

  *entries() {
    for (const [key, entry] of this.#cache) {
      if (Date.now() < entry.expiresAt) {
        yield {
          key,
          value: entry.value
        };
      }
    }
  }
}

// Demo: API responses ko cache kar ke repeated requests handle karna.
const apiCache = new APICache(3, 5000);

console.log("\n--- Saving API Responses ---");

apiCache.set("users", ["Usman", "Ali", "Ahmed"]);
apiCache.set("products", ["Laptop", "Mouse"]);
apiCache.set("courses", ["JavaScript", "React"]);

console.log("\n--- Reading Cached Data ---");

console.log("Users:", apiCache.get("users"));
console.log("Products:", apiCache.get("products"));

console.log("\n--- Adding Another Response ---");

apiCache.set("orders", ["Order-101", "Order-102"]);

console.log("\n--- Checking Cache ---");

console.log("Users:", apiCache.get("users"));
console.log("Courses:", apiCache.get("courses"));
console.log("Orders:", apiCache.get("orders"));

console.log("\n--- Current Cache Entries ---");

for (const entry of apiCache.entries()) {
  console.log(`${entry.key}:`, entry.value);
}

console.log("\n--- Cache Statistics ---");

console.log(apiCache.getStats());

console.log("\n--- Removing an Entry ---");

apiCache.delete("orders");

console.log("Current cache size:", apiCache.size);

/**
 * OUTPUT
 [Running] node "f:\javascript-in-30-days\day27.js"

--- Saving API Responses ---
"users" cache mein save ho gaya.
"products" cache mein save ho gaya.
"courses" cache mein save ho gaya.

--- Reading Cached Data ---
Cache hit: "users"
Users: [ 'Usman', 'Ali', 'Ahmed' ]
Cache hit: "products"
Products: [ 'Laptop', 'Mouse' ]

--- Adding Another Response ---
Cache full tha, "courses" remove kar diya.
"orders" cache mein save ho gaya.

--- Checking Cache ---
Cache hit: "users"
Users: [ 'Usman', 'Ali', 'Ahmed' ]
Cache miss: "courses"
Courses: null
Cache hit: "orders"
Orders: [ 'Order-101', 'Order-102' ]

--- Current Cache Entries ---
products: [ 'Laptop', 'Mouse' ]
users: [ 'Usman', 'Ali', 'Ahmed' ]
orders: [ 'Order-101', 'Order-102' ]

--- Cache Statistics ---
{
  hits: 4,
  misses: 1,
  totalRequests: 5,
  hitRate: '80.00%',
  currentSize: 3,
  maxSize: 3
}

--- Removing an Entry ---
"orders" cache se remove ho gaya.
Current cache size: 2

[Done] exited with code=0 in 0.315 seconds


 */