
/*
  Day 25: Real-Time Chat Room & Event Management System

  This project simulates a chat room where users can join,
  send messages, leave, and trigger event-driven actions.
*/

const EventEmitter = require("node:events");

// Chat room class using EventEmitter
class ChatRoom extends EventEmitter {
  #users = new Map();
  #messages = [];
  #blockedMessages = [];
  #bannedWords = new Set(["spamword", "badword"]);

  // Add a user to the chat room
  join(userId, username) {
    if (!userId || !username?.trim()) {
      throw new Error("Valid user ID and username are required.");
    }

    if (this.#users.has(userId)) {
      throw new Error(`${username} is already in the chat room.`);
    }

    const user = {
      userId,
      username: username.trim(),
      joinedAt: new Date()
    };

    this.#users.set(userId, user);

    this.emit("userJoined", user);

    return user;
  }

  // Send a message to the chat room
  sendMessage(userId, message) {
    const user = this.#users.get(userId);

    if (!user) {
      throw new Error("User must join the room before sending messages.");
    }

    if (typeof message !== "string" || !message.trim()) {
      throw new Error("Message cannot be empty.");
    }

    const cleanMessage = message.trim();
    const lowerMessage = cleanMessage.toLowerCase();

    // Check messages against the moderation word list
    const containsBannedWord = [...this.#bannedWords].some(
      (word) => lowerMessage.includes(word)
    );

    if (containsBannedWord) {
      const blockedRecord = {
        userId,
        username: user.username,
        message: cleanMessage,
        reason: "Message contains a restricted word",
        timestamp: new Date()
      };

      this.#blockedMessages.push(blockedRecord);
      this.emit("messageBlocked", blockedRecord);

      return false;
    }

    const messageRecord = {
      id: this.#messages.length + 1,
      userId,
      username: user.username,
      message: cleanMessage,
      timestamp: new Date()
    };

    this.#messages.push(messageRecord);

    this.emit("messageSent", messageRecord);

    return true;
  }

  // Remove a user from the room
  leave(userId) {
    const user = this.#users.get(userId);

    if (!user) {
      return false;
    }

    this.#users.delete(userId);

    this.emit("userLeft", user);

    return true;
  }

  // Return a safe copy of the current user list
  getUsers() {
    return [...this.#users.values()];
  }

  // Return a safe copy of chat history
  getMessages() {
    return [...this.#messages];
  }

  // Return a safe copy of blocked messages
  getBlockedMessages() {
    return [...this.#blockedMessages];
  }

  // Generate room statistics
  getStats() {
    const messagesByUser = this.#messages.reduce((summary, message) => {
      summary.set(
        message.username,
        (summary.get(message.username) || 0) + 1
      );

      return summary;
    }, new Map());

    return {
      activeUsers: this.#users.size,
      totalMessages: this.#messages.length,
      blockedMessages: this.#blockedMessages.length,
      messagesByUser: Object.fromEntries(messagesByUser)
    };
  }
}

// Create a chat room instance
const room = new ChatRoom();

// Event listener: user joins
room.on("userJoined", (user) => {
  console.log(`[JOIN] ${user.username} joined the chat room.`);
});

// Event listener: new message
room.on("messageSent", (message) => {
  console.log(`[MESSAGE] ${message.username}: ${message.message}`);
});

// Event listener: blocked message
room.on("messageBlocked", (record) => {
  console.log(
    `[MODERATION] Message from ${record.username} was blocked.`
  );
});

// Event listener: user leaves
room.on("userLeft", (user) => {
  console.log(`[LEAVE] ${user.username} left the chat room.`);
});

// One-time listener: runs only for the first accepted message
room.once("messageSent", (message) => {
  console.log(
    `[SYSTEM] First message received from ${message.username}.`
  );
});

// Simulate chat room activity
console.log("========================================");
console.log(" REAL-TIME CHAT ROOM SYSTEM");
console.log("========================================");

console.log("\n--- USER JOINING EVENTS ---");

room.join(1, "Usman");
room.join(2, "Ali");
room.join(3, "Ahmed");

console.log("\n--- CHAT MESSAGE EVENTS ---");

room.sendMessage(1, "Hey everyone! Welcome to the chat.");
room.sendMessage(2, "Hello! How is everyone doing?");
room.sendMessage(3, "This message contains badword.");
room.sendMessage(1, "Let's discuss our JavaScript projects.");

console.log("\n--- USER LEAVING EVENT ---");

room.leave(2);

console.log("\n--- ACTIVE USERS ---");

room.getUsers().forEach((user) => {
  console.log(`${user.userId}: ${user.username}`);
});

console.log("\n--- CHAT HISTORY ---");

room.getMessages().forEach((message) => {
  console.log(
    `${message.id}. ${message.username}: ${message.message}`
  );
});

console.log("\n--- MODERATION REPORT ---");

room.getBlockedMessages().forEach((record) => {
  console.log(
    `${record.username}: ${record.message} | Reason: ${record.reason}`
  );
});

console.log("\n--- CHAT ROOM STATISTICS ---");

const stats = room.getStats();

console.log("Active users:", stats.activeUsers);
console.log("Accepted messages:", stats.totalMessages);
console.log("Blocked messages:", stats.blockedMessages);

console.log("\n--- MESSAGES BY USER ---");

Object.entries(stats.messagesByUser).forEach(([username, count]) => {
  console.log(`${username}: ${count} message(s)`);
});

console.log("\n--- EVENT SYSTEM CHECK ---");

console.log(
  "Message listener count:",
  room.listenerCount("messageSent")
);

console.log(
  "Join event listener count:",
  room.listenerCount("userJoined")
);

console.log(
  "Does chat have messages?",
  room.getMessages().length > 0
);

console.log(
  "Are all accepted messages non-empty?",
  room.getMessages().every((message) => message.message.length > 0)
);

console.log("\nChat room simulation completed successfully.");

/**
 * OUTPUT
 
[Running] node "f:\javascript-in-30-days\day25.js"
========================================
 REAL-TIME CHAT ROOM SYSTEM
========================================

--- USER JOINING EVENTS ---
[JOIN] Usman joined the chat room.
[JOIN] Ali joined the chat room.
[JOIN] Ahmed joined the chat room.

--- CHAT MESSAGE EVENTS ---
[MESSAGE] Usman: Hey everyone! Welcome to the chat.
[SYSTEM] First message received from Usman.
[MESSAGE] Ali: Hello! How is everyone doing?
[MODERATION] Message from Ahmed was blocked.
[MESSAGE] Usman: Let's discuss our JavaScript projects.

--- USER LEAVING EVENT ---
[LEAVE] Ali left the chat room.

--- ACTIVE USERS ---
1: Usman
3: Ahmed

--- CHAT HISTORY ---
1. Usman: Hey everyone! Welcome to the chat.
2. Ali: Hello! How is everyone doing?
3. Usman: Let's discuss our JavaScript projects.

--- MODERATION REPORT ---
Ahmed: This message contains badword. | Reason: Message contains a restricted word

--- CHAT ROOM STATISTICS ---
Active users: 2
Accepted messages: 3
Blocked messages: 1

--- MESSAGES BY USER ---
Usman: 2 message(s)
Ali: 1 message(s)

--- EVENT SYSTEM CHECK ---
Message listener count: 1
Join event listener count: 1
Does chat have messages? true
Are all accepted messages non-empty? true

Chat room simulation completed successfully.

[Done] exited with code=0 in 0.12 seconds


 */