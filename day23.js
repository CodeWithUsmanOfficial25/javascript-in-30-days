
/*
  Day 23: Real-Time Log Monitoring & Alert System

  This project simulates application server logs, detects errors,
  identifies repeated issues, and generates monitoring alerts.
*/

// Simulated application server logs
const serverLogs = [
  {
    id: 1,
    timestamp: "2026-10-30T09:00:00",
    service: "Auth Service",
    level: "INFO",
    message: "User login successful"
  },
  {
    id: 2,
    timestamp: "2026-10-30T09:02:00",
    service: "Payment Service",
    level: "ERROR",
    message: "Payment gateway timeout"
  },
  {
    id: 3,
    timestamp: "2026-10-30T09:04:00",
    service: "Database Service",
    level: "WARNING",
    message: "Database response is slow"
  },
  {
    id: 4,
    timestamp: "2026-10-30T09:06:00",
    service: "Payment Service",
    level: "ERROR",
    message: "Payment gateway timeout"
  },
  {
    id: 5,
    timestamp: "2026-10-30T09:08:00",
    service: "Auth Service",
    level: "INFO",
    message: "User session created"
  },
  {
    id: 6,
    timestamp: "2026-10-30T09:10:00",
    service: "API Service",
    level: "CRITICAL",
    message: "API server connection lost"
  },
  {
    id: 7,
    timestamp: "2026-10-30T09:12:00",
    service: "Database Service",
    level: "ERROR",
    message: "Database connection failed"
  },
  {
    id: 8,
    timestamp: "2026-10-30T09:14:00",
    service: "Payment Service",
    level: "ERROR",
    message: "Payment gateway timeout"
  },
  {
    id: 9,
    timestamp: "2026-10-30T09:16:00",
    service: "API Service",
    level: "WARNING",
    message: "High API response time"
  },
  {
    id: 10,
    timestamp: "2026-10-30T09:18:00",
    service: "Auth Service",
    level: "INFO",
    message: "User logout successful"
  },
  {
    id: 11,
    timestamp: "2026-10-30T09:20:00",
    service: "Database Service",
    level: "CRITICAL",
    message: "Database storage almost full"
  },
  {
    id: 12,
    timestamp: "2026-10-30T09:22:00",
    service: "API Service",
    level: "ERROR",
    message: "Request processing failed"
  }
];

// Supported log levels
const validLevels = new Set([
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL"
]);

// Validate individual log records
const validateLog = (log) => {
  return (
    Number.isInteger(log.id) &&
    log.id > 0 &&
    typeof log.service === "string" &&
    log.service.trim().length > 0 &&
    typeof log.message === "string" &&
    log.message.trim().length > 0 &&
    validLevels.has(log.level) &&
    !Number.isNaN(Date.parse(log.timestamp))
  );
};

// Separate valid and invalid logs
const validLogs = serverLogs.filter(validateLog);

const invalidLogs = serverLogs.filter(
  (log) => !validateLog(log)
);

// Remove duplicate log IDs
const uniqueLogs = [];
const processedIds = new Set();

validLogs.forEach((log) => {
  if (!processedIds.has(log.id)) {
    processedIds.add(log.id);
    uniqueLogs.push(log);
  }
});

// Sort logs chronologically
const chronologicalLogs = [...uniqueLogs].sort(
  (a, b) =>
    new Date(a.timestamp).getTime() -
    new Date(b.timestamp).getTime()
);

// Classify logs by severity
const logsByLevel = chronologicalLogs.reduce((groups, log) => {
  groups[log.level] ??= [];
  groups[log.level].push(log);

  return groups;
}, {});

// Group logs by service using Map
const logsByService = new Map();

chronologicalLogs.forEach((log) => {
  if (!logsByService.has(log.service)) {
    logsByService.set(log.service, []);
  }

  logsByService.get(log.service).push(log);
});

// Find all error and critical logs
const errorLogs = chronologicalLogs.filter(
  (log) => log.level === "ERROR" || log.level === "CRITICAL"
);

// Identify critical alerts
const criticalAlerts = chronologicalLogs.filter(
  (log) => log.level === "CRITICAL"
);

// Count repeated error messages
const errorFrequency = errorLogs.reduce((frequency, log) => {
  frequency.set(
    log.message,
    (frequency.get(log.message) || 0) + 1
  );

  return frequency;
}, new Map());

// Find repeated errors
const repeatedErrors = [...errorFrequency.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

// Generate monitoring alerts
const alerts = [];

criticalAlerts.forEach((log) => {
  alerts.push({
    type: "CRITICAL",
    service: log.service,
    message: log.message
  });
});

repeatedErrors.forEach(([message, count]) => {
  alerts.push({
    type: "REPEATED ERROR",
    service: "Multiple/Related Logs",
    message: `${message} occurred ${count} times`
  });
});

// Calculate service-wise statistics
const serviceStatistics = [...logsByService.entries()].map(
  ([service, logs]) => {
    const serviceErrors = logs.filter(
      (log) => log.level === "ERROR" || log.level === "CRITICAL"
    );

    return {
      service,
      totalLogs: logs.length,
      errors: serviceErrors.length,
      critical: logs.filter(
        (log) => log.level === "CRITICAL"
      ).length
    };
  }
);

// Find the service with the most errors
const highestErrorService = serviceStatistics.reduce(
  (highest, current) =>
    current.errors > highest.errors ? current : highest
);

// Overall log statistics
const totalLogs = chronologicalLogs.length;

const levelSummary = chronologicalLogs.reduce(
  (summary, log) => {
    summary[log.level] = (summary[log.level] || 0) + 1;
    return summary;
  },
  {}
);

// Check monitoring conditions
const hasCriticalAlerts = criticalAlerts.length > 0;

const allLogsValid = chronologicalLogs.every(validateLog);

const hasServerErrors = chronologicalLogs.some(
  (log) => log.level === "ERROR" || log.level === "CRITICAL"
);

// Display monitoring report
console.log("========================================");
console.log(" APPLICATION LOG MONITORING SYSTEM");
console.log("========================================");

console.log("\n--- LOG VALIDATION ---");
console.log("Total received logs:", serverLogs.length);
console.log("Valid logs:", totalLogs);
console.log("Invalid logs:", invalidLogs.length);
console.log("Unique log IDs:", processedIds.size);

console.log("\n--- SEVERITY SUMMARY ---");

Object.entries(levelSummary).forEach(([level, count]) => {
  console.log(`${level}: ${count}`);
});

console.log("\n--- CRITICAL ALERTS ---");

if (criticalAlerts.length === 0) {
  console.log("No critical alerts detected.");
} else {
  criticalAlerts.forEach((log) => {
    console.log(`[CRITICAL] ${log.service}: ${log.message}`);
  });
}

console.log("\n--- REPEATED ERRORS ---");

if (repeatedErrors.length === 0) {
  console.log("No repeated errors detected.");
} else {
  repeatedErrors.forEach(([message, count]) => {
    console.log(`${message} | Occurrences: ${count}`);
  });
}

console.log("\n--- SERVICE-WISE MONITORING ---");

serviceStatistics.forEach((service) => {
  console.log(
    `${service.service} | Logs: ${service.totalLogs} | ` +
    `Errors: ${service.errors} | Critical: ${service.critical}`
  );
});

console.log("\n--- HIGHEST ERROR SERVICE ---");
console.log("Service:", highestErrorService.service);
console.log("Total errors:", highestErrorService.errors);

console.log("\n--- MONITORING ALERT REPORT ---");

if (alerts.length === 0) {
  console.log("System operating normally.");
} else {
  alerts.forEach((alert, index) => {
    console.log(
      `${index + 1}. [${alert.type}] ${alert.service}: ${alert.message}`
    );
  });
}

console.log("\n--- SYSTEM HEALTH CHECK ---");
console.log("All logs valid:", allLogsValid);
console.log("Critical alerts detected:", hasCriticalAlerts);
console.log("Server errors detected:", hasServerErrors);
console.log("Total services monitored:", logsByService.size);

console.log("\nLog monitoring report generated successfully.");
/**
 * OUTPUT
 
Running] node "f:\javascript-in-30-days\day23.js"
========================================
 APPLICATION LOG MONITORING SYSTEM
========================================

--- LOG VALIDATION ---
Total received logs: 12
Valid logs: 12
Invalid logs: 0
Unique log IDs: 12

--- SEVERITY SUMMARY ---
INFO: 3
ERROR: 5
WARNING: 2
CRITICAL: 2

--- CRITICAL ALERTS ---
[CRITICAL] API Service: API server connection lost
[CRITICAL] Database Service: Database storage almost full

--- REPEATED ERRORS ---
Payment gateway timeout | Occurrences: 3

--- SERVICE-WISE MONITORING ---
Auth Service | Logs: 3 | Errors: 0 | Critical: 0
Payment Service | Logs: 3 | Errors: 3 | Critical: 0
Database Service | Logs: 3 | Errors: 2 | Critical: 1
API Service | Logs: 3 | Errors: 2 | Critical: 1

--- HIGHEST ERROR SERVICE ---
Service: Payment Service
Total errors: 3

--- MONITORING ALERT REPORT ---
1. [CRITICAL] API Service: API server connection lost
2. [CRITICAL] Database Service: Database storage almost full
3. [REPEATED ERROR] Multiple/Related Logs: Payment gateway timeout occurred 3 times

--- SYSTEM HEALTH CHECK ---
All logs valid: true
Critical alerts detected: true
Server errors detected: true
Total services monitored: 4

Log monitoring report generated successfully.

[Done] exited with code=0 in 0.231 seconds


 */