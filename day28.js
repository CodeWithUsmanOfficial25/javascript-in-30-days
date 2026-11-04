
class FeatureFlagError extends Error {
  constructor(message) {
    super(message);
    this.name = "FeatureFlagError";
  }
}

class FeatureFlagManager {
  #flags = new Map();

  static validPercentage(value) {
    return Number.isFinite(value) && value >= 0 && value <= 100;
  }

  addFlag(name, enabled = false, rollout = 100) {
    if (!name || typeof name !== "string") {
      throw new FeatureFlagError("Feature ka valid name required hai.");
    }

    if (this.#flags.has(name)) {
      throw new FeatureFlagError(`"${name}" pehle se registered hai.`);
    }

    if (typeof enabled !== "boolean") {
      throw new FeatureFlagError("Enabled value true ya false honi chahiye.");
    }

    if (!FeatureFlagManager.validPercentage(rollout)) {
      throw new FeatureFlagError("Rollout 0 se 100 ke darmiyan hona chahiye.");
    }

    this.#flags.set(name, {
      enabled,
      rollout,
      allowedUsers: new Set(),
      blockedUsers: new Set()
    });

    console.log(`Feature "${name}" register ho gaya.`);
  }

  enable(name) {
    const flag = this.#getFlag(name);
    flag.enabled = true;

    console.log(`"${name}" enable ho gaya.`);
  }

  disable(name) {
    const flag = this.#getFlag(name);
    flag.enabled = false;

    console.log(`"${name}" disable ho gaya.`);
  }

  setRollout(name, percentage) {
    if (!FeatureFlagManager.validPercentage(percentage)) {
      throw new FeatureFlagError("Rollout 0 se 100 ke darmiyan hona chahiye.");
    }

    const flag = this.#getFlag(name);
    flag.rollout = percentage;

    console.log(`"${name}" ka rollout ${percentage}% ho gaya.`);
  }

  allowUser(name, userId) {
    const flag = this.#getFlag(name);

    if (!userId) {
      throw new FeatureFlagError("Valid user ID required hai.");
    }

    flag.blockedUsers.delete(userId);
    flag.allowedUsers.add(userId);
  }

  blockUser(name, userId) {
    const flag = this.#getFlag(name);

    if (!userId) {
      throw new FeatureFlagError("Valid user ID required hai.");
    }

    flag.allowedUsers.delete(userId);
    flag.blockedUsers.add(userId);
  }

  isEnabled(name, userId) {
    const flag = this.#getFlag(name);

    if (!flag.enabled) {
      return false;
    }

    if (flag.blockedUsers.has(userId)) {
      return false;
    }

    if (flag.allowedUsers.has(userId)) {
      return true;
    }

    return this.#getUserBucket(userId) < flag.rollout;
  }

  #getUserBucket(userId) {
    let hash = 0;

    // Same user ko har dafa same rollout bucket milta hai.
    for (const char of String(userId)) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }

    return hash % 100;
  }

  #getFlag(name) {
    const flag = this.#flags.get(name);

    if (!flag) {
      throw new FeatureFlagError(`"${name}" feature nahi mila.`);
    }

    return flag;
  }

  getAllFlags() {
    return [...this.#flags.entries()].map(([name, flag]) => ({
      name,
      enabled: flag.enabled,
      rollout: flag.rollout,
      allowedUsers: flag.allowedUsers.size,
      blockedUsers: flag.blockedUsers.size
    }));
  }
}

// Demo
const flags = new FeatureFlagManager();

console.log("\n--- Registering Features ---");

flags.addFlag("new-dashboard", true, 30);
flags.addFlag("dark-mode", true, 100);
flags.addFlag("beta-checkout", false, 50);

console.log("\n--- User Access ---");

const users = ["user101", "user202", "user303", "user404"];

for (const user of users) {
  console.log(
    `${user}:`,
    flags.isEnabled("new-dashboard", user)
  );
}

console.log("\n--- Special User Access ---");

flags.allowUser("new-dashboard", "user404");
flags.blockUser("dark-mode", "user202");

console.log(
  "user404 dashboard:",
  flags.isEnabled("new-dashboard", "user404")
);

console.log(
  "user202 dark mode:",
  flags.isEnabled("dark-mode", "user202")
);

console.log("\n--- Updating Rollout ---");

flags.setRollout("new-dashboard", 100);

console.log(
  "user101 dashboard:",
  flags.isEnabled("new-dashboard", "user101")
);

console.log("\n--- Disabling Feature ---");

flags.disable("dark-mode");

console.log(
  "user101 dark mode:",
  flags.isEnabled("dark-mode", "user101")
);

console.log("\n--- Feature Overview ---");

console.table(flags.getAllFlags());

/*
OUTPUT

[Running] node "f:\javascript-in-30-days\day28.js"

--- Registering Features ---
Feature "new-dashboard" register ho gaya.
Feature "dark-mode" register ho gaya.
Feature "beta-checkout" register ho gaya.

--- User Access ---
user101: false
user202: true
user303: false
user404: false

--- Special User Access ---
user404 dashboard: true
user202 dark mode: false

--- Updating Rollout ---
"new-dashboard" ka rollout 100% ho gaya.
user101 dashboard: true

--- Disabling Feature ---
"dark-mode" disable ho gaya.
user101 dark mode: false

--- Feature Overview ---
┌─────────┬─────────────────┬─────────┬─────────┬──────────────┬──────────────┐
│ (index) │ name            │ enabled │ rollout │ allowedUsers │ blockedUsers │
├─────────┼─────────────────┼─────────┼─────────┼──────────────┼──────────────┤
│ 0       │ 'new-dashboard' │ true    │ 100     │ 1            │ 0            │
│ 1       │ 'dark-mode'     │ false   │ 100     │ 0            │ 1            │
│ 2       │ 'beta-checkout' │ false   │ 50      │ 0            │ 0            │
└─────────┴─────────────────┴─────────┴─────────┴──────────────┴──────────────┘

[Done] exited with code=0 in 0.322 seconds

*/