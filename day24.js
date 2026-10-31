
/*
  Day 24: Smart API Request & Response Manager

  This project simulates API requests, handles failures,
  retries unsuccessful requests, and generates a response report.
*/

// Simulated API request records
const apiRequests = [
  {
    id: 1,
    endpoint: "/api/users",
    method: "GET",
    service: "User Service",
    failAttempts: 0,
    responseTime: 120
  },
  {
    id: 2,
    endpoint: "/api/products",
    method: "GET",
    service: "Product Service",
    failAttempts: 1,
    responseTime: 180
  },
  {
    id: 3,
    endpoint: "/api/orders",
    method: "POST",
    service: "Order Service",
    failAttempts: 3,
    responseTime: 250
  },
  {
    id: 4,
    endpoint: "/api/payments",
    method: "POST",
    service: "Payment Service",
    failAttempts: 0,
    responseTime: 300
  },
  {
    id: 5,
    endpoint: "/api/profile",
    method: "GET",
    service: "User Service",
    failAttempts: 2,
    responseTime: 150
  },
  {
    id: 6,
    endpoint: "/api/reports",
    method: "GET",
    service: "Report Service",
    failAttempts: 4,
    responseTime: 220
  }
];

const MAX_RETRIES = 2;
const BASE_DELAY = 100;

// Store request outcomes for monitoring
const requestHistory = new Map();

// Track endpoints that eventually succeed
const successfulEndpoints = new Set();

// Simulate a small network delay
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Validate incoming request records
const validateRequest = (request) => {
  const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  return (
    Number.isInteger(request.id) &&
    request.id > 0 &&
    typeof request.endpoint === "string" &&
    request.endpoint.startsWith("/api/") &&
    validMethods.includes(request.method) &&
    typeof request.service === "string" &&
    request.service.trim().length > 0 &&
    Number.isInteger(request.failAttempts) &&
    request.failAttempts >= 0 &&
    Number.isFinite(request.responseTime) &&
    request.responseTime > 0
  );
};

// Simulate one API request attempt
const sendRequest = async (request, attemptNumber) => {
  await wait(50);

  if (attemptNumber <= request.failAttempts) {
    throw new Error(`Temporary server error at ${request.endpoint}`);
  }

  return {
    endpoint: request.endpoint,
    method: request.method,
    statusCode: 200,
    responseTime: request.responseTime,
    message: "Request completed successfully"
  };
};

// Execute a request with retry handling
const executeRequest = async (request) => {
  let attempts = 0;
  let lastError;

  while (attempts <= MAX_RETRIES) {
    attempts++;

    try {
      const response = await sendRequest(request, attempts);

      const result = {
        id: request.id,
        endpoint: request.endpoint,
        service: request.service,
        status: "SUCCESS",
        statusCode: response.statusCode,
        attempts,
        responseTime: response.responseTime,
        message: response.message
      };

      requestHistory.set(request.id, result);
      successfulEndpoints.add(request.endpoint);

      return result;
    } catch (error) {
      lastError = error;

      if (attempts <= MAX_RETRIES) {
        const retryDelay = BASE_DELAY * 2 ** (attempts - 1);

        console.log(
          `Retry ${attempts} for ${request.endpoint} ` +
          `after ${retryDelay}ms`
        );

        await wait(retryDelay);
      }
    }
  }

  const failedResult = {
    id: request.id,
    endpoint: request.endpoint,
    service: request.service,
    status: "FAILED",
    statusCode: 500,
    attempts,
    responseTime: null,
    message: lastError.message
  };

  requestHistory.set(request.id, failedResult);

  return failedResult;
};

// Separate valid and invalid requests
const validRequests = apiRequests.filter(validateRequest);

const invalidRequests = apiRequests.filter(
  (request) => !validateRequest(request)
);

// Process all valid requests concurrently
const runApiManager = async () => {
  console.log("========================================");
  console.log(" SMART API REQUEST MANAGER");
  console.log("========================================");

  console.log("\n--- REQUEST VALIDATION ---");
  console.log("Total requests:", apiRequests.length);
  console.log("Valid requests:", validRequests.length);
  console.log("Invalid requests:", invalidRequests.length);

  console.log("\n--- PROCESSING API REQUESTS ---");

  const settledResults = await Promise.allSettled(
    validRequests.map((request) => executeRequest(request))
  );

  // Extract completed results from settled promises
  const results = settledResults
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value);

  const rejectedTasks = settledResults.filter(
    (item) => item.status === "rejected"
  );

  // Analyze successful and failed requests
  const successfulRequests = results.filter(
    (result) => result.status === "SUCCESS"
  );

  const failedRequests = results.filter(
    (result) => result.status === "FAILED"
  );

  // Calculate overall request statistics
  const totalAttempts = results.reduce(
    (total, result) => total + result.attempts,
    0
  );

  const totalResponseTime = successfulRequests.reduce(
    (total, result) => total + result.responseTime,
    0
  );

  const averageResponseTime =
    successfulRequests.length > 0
      ? totalResponseTime / successfulRequests.length
      : 0;

  // Count requests by service
  const serviceSummary = results.reduce((summary, result) => {
    if (!summary.has(result.service)) {
      summary.set(result.service, {
        total: 0,
        successful: 0,
        failed: 0
      });
    }

    const service = summary.get(result.service);

    service.total++;

    if (result.status === "SUCCESS") {
      service.successful++;
    } else {
      service.failed++;
    }

    return summary;
  }, new Map());

  // Identify requests that needed retries
  const retriedRequests = results.filter(
    (result) => result.attempts > 1
  );

  // Generate detailed request report
  console.log("\n--- REQUEST RESULTS ---");

  results.forEach((result) => {
    console.log(
      `${result.method} ${result.endpoint} | ` +
      `${result.status} | Attempts: ${result.attempts} | ` +
      `Status Code: ${result.statusCode}`
    );
  });

  console.log("\n--- RETRY SUMMARY ---");

  console.log("Requests requiring retries:", retriedRequests.length);

  retriedRequests.forEach((request) => {
    console.log(
      `${request.endpoint} required ${request.attempts - 1} retry attempt(s)`
    );
  });

  console.log("\n--- SUCCESS AND FAILURE SUMMARY ---");

  console.log("Successful requests:", successfulRequests.length);
  console.log("Failed requests:", failedRequests.length);
  console.log("Rejected processing tasks:", rejectedTasks.length);
  console.log("Total attempts:", totalAttempts);

  console.log("\n--- SERVICE-WISE REPORT ---");

  serviceSummary.forEach((summary, service) => {
    console.log(
      `${service} | Total: ${summary.total} | ` +
      `Successful: ${summary.successful} | Failed: ${summary.failed}`
    );
  });

  console.log("\n--- RESPONSE TIME ANALYSIS ---");

  console.log(
    "Average successful response time:",
    `${averageResponseTime.toFixed(2)}ms`
  );

  console.log(
    "Fastest response:",
    successfulRequests.length > 0
      ? `${Math.min(...successfulRequests.map((item) => item.responseTime))}ms`
      : "N/A"
  );

  console.log(
    "Slowest response:",
    successfulRequests.length > 0
      ? `${Math.max(...successfulRequests.map((item) => item.responseTime))}ms`
      : "N/A"
  );

  console.log("\n--- SUCCESSFUL ENDPOINTS ---");

  successfulEndpoints.forEach((endpoint) => {
    console.log(endpoint);
  });

  console.log("\n--- SYSTEM HEALTH CHECK ---");

  console.log(
    "All valid requests processed:",
    results.length === validRequests.length
  );

  console.log(
    "Any failed requests:",
    failedRequests.length > 0
  );

  console.log(
    "All request records valid:",
    validRequests.every(validateRequest)
  );

  console.log(
    "At least one request succeeded:",
    successfulRequests.some((request) => request.status === "SUCCESS")
  );

  console.log("\nAPI request monitoring completed successfully.");
};

runApiManager().catch((error) => {
  console.error("API Manager encountered an unexpected error:", error);
});
/**
 * OUTPUT
 [Running] node "f:\javascript-in-30-days\day24.js"
========================================
 SMART API REQUEST MANAGER
========================================

--- REQUEST VALIDATION ---
Total requests: 6
Valid requests: 6
Invalid requests: 0

--- PROCESSING API REQUESTS ---
Retry 1 for /api/products after 100ms
Retry 1 for /api/orders after 100ms
Retry 1 for /api/profile after 100ms
Retry 1 for /api/reports after 100ms
Retry 2 for /api/orders after 200ms
Retry 2 for /api/profile after 200ms
Retry 2 for /api/reports after 200ms

--- REQUEST RESULTS ---
undefined /api/users | SUCCESS | Attempts: 1 | Status Code: 200
undefined /api/products | SUCCESS | Attempts: 2 | Status Code: 200
undefined /api/orders | FAILED | Attempts: 3 | Status Code: 500
undefined /api/payments | SUCCESS | Attempts: 1 | Status Code: 200
undefined /api/profile | SUCCESS | Attempts: 3 | Status Code: 200
undefined /api/reports | FAILED | Attempts: 3 | Status Code: 500

--- RETRY SUMMARY ---
Requests requiring retries: 4
/api/products required 1 retry attempt(s)
/api/orders required 2 retry attempt(s)
/api/profile required 2 retry attempt(s)
/api/reports required 2 retry attempt(s)

--- SUCCESS AND FAILURE SUMMARY ---
Successful requests: 4
Failed requests: 2
Rejected processing tasks: 0
Total attempts: 13

--- SERVICE-WISE REPORT ---
User Service | Total: 2 | Successful: 2 | Failed: 0
Product Service | Total: 1 | Successful: 1 | Failed: 0
Order Service | Total: 1 | Successful: 0 | Failed: 1
Payment Service | Total: 1 | Successful: 1 | Failed: 0
Report Service | Total: 1 | Successful: 0 | Failed: 1

--- RESPONSE TIME ANALYSIS ---
Average successful response time: 187.50ms
Fastest response: 120ms
Slowest response: 300ms

--- SUCCESSFUL ENDPOINTS ---
/api/users
/api/payments
/api/products
/api/profile

--- SYSTEM HEALTH CHECK ---
All valid requests processed: true
Any failed requests: true
All request records valid: true
At least one request succeeded: true

API request monitoring completed successfully.

[Done] exited with code=0 in 0.77 seconds


 */