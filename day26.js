
/*
  Day 26: Smart Job Application Tracking System

  This project manages job applications, tracks their statuses,
  schedules interviews, and generates application analytics.
*/

// Custom error for invalid application data
class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApplicationError";
  }
}

// Job application manager
class JobTracker {
  #applications = new Map();
  #companies = new Set();

  static VALID_STATUSES = [
    "Applied",
    "Assessment",
    "Interview",
    "Rejected",
    "Offer"
  ];

  // Validate application data
  static validateApplication(application) {
    if (
      !application.id ||
      !application.company?.trim() ||
      !application.position?.trim() ||
      !application.status ||
      !this.VALID_STATUSES.includes(application.status)
    ) {
      throw new ApplicationError("Invalid job application data.");
    }

    if (
      application.interviewDate &&
      Number.isNaN(Date.parse(application.interviewDate))
    ) {
      throw new ApplicationError("Invalid interview date.");
    }

    return true;
  }

  // Add a new application
  addApplication(application) {
    JobTracker.validateApplication(application);

    if (this.#applications.has(application.id)) {
      throw new ApplicationError(
        `Application ID ${application.id} already exists.`
      );
    }

    const newApplication = {
      ...application,
      company: application.company.trim(),
      position: application.position.trim(),
      createdAt: new Date().toISOString()
    };

    this.#applications.set(newApplication.id, newApplication);
    this.#companies.add(newApplication.company);

    return newApplication;
  }

  // Update an application's status
  updateStatus(id, newStatus) {
    const application = this.#applications.get(id);

    if (!application) {
      throw new ApplicationError("Application not found.");
    }

    if (!JobTracker.VALID_STATUSES.includes(newStatus)) {
      throw new ApplicationError("Invalid application status.");
    }

    application.status = newStatus;

    return application;
  }

  // Find an application by ID
  getApplication(id) {
    return this.#applications.get(id) || null;
  }

  // Return all applications
  getAllApplications() {
    return [...this.#applications.values()];
  }

  // Filter applications by status
  getByStatus(status) {
    return this.getAllApplications().filter(
      (application) => application.status === status
    );
  }

  // Find applications with upcoming interviews
  getInterviewSchedule() {
    return this.getAllApplications()
      .filter(
        (application) =>
          application.status === "Interview" &&
          application.interviewDate
      )
      .sort(
        (a, b) =>
          new Date(a.interviewDate) - new Date(b.interviewDate)
      );
  }

  // Generate application statistics
  getStatistics() {
    const applications = this.getAllApplications();

    const statusSummary = applications.reduce((summary, application) => {
      summary[application.status] =
        (summary[application.status] || 0) + 1;

      return summary;
    }, {});

    const offers = applications.filter(
      (application) => application.status === "Offer"
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "Rejected"
    ).length;

    const active = applications.filter(
      (application) =>
        ["Applied", "Assessment", "Interview"].includes(application.status)
    ).length;

    return {
      total: applications.length,
      active,
      offers,
      rejected,
      companies: this.#companies.size,
      statusSummary,
      offerRate:
        applications.length === 0
          ? 0
          : ((offers / applications.length) * 100).toFixed(2)
    };
  }

  // Generator: yield applications one by one
  *applicationGenerator() {
    for (const application of this.#applications.values()) {
      yield application;
    }
  }

  // Custom iterator: make JobTracker iterable
  [Symbol.iterator]() {
    return this.#applications.values();
  }

  // Static method to compare two applications by priority
  static compareByStatus(a, b) {
    const priority = {
      Offer: 1,
      Interview: 2,
      Assessment: 3,
      Applied: 4,
      Rejected: 5
    };

    return priority[a.status] - priority[b.status];
  }
}

// Create the tracker
const tracker = new JobTracker();

// Add sample applications
const sampleApplications = [
  {
    id: 1,
    company: "Tech Solutions",
    position: "Frontend Developer",
    status: "Applied",
    interviewDate: null
  },
  {
    id: 2,
    company: "CodeWorks",
    position: "Backend Developer",
    status: "Interview",
    interviewDate: "2026-11-05"
  },
  {
    id: 3,
    company: "Digital Labs",
    position: "JavaScript Developer",
    status: "Assessment",
    interviewDate: null
  },
  {
    id: 4,
    company: "Cloud Systems",
    position: "Junior Full Stack Developer",
    status: "Rejected",
    interviewDate: null
  },
  {
    id: 5,
    company: "WebCraft",
    position: "React Developer",
    status: "Interview",
    interviewDate: "2026-11-08"
  },
  {
    id: 6,
    company: "Innovate Tech",
    position: "Node.js Developer",
    status: "Offer",
    interviewDate: null
  },
  {
    id: 7,
    company: "NextGen Software",
    position: "Software Engineer",
    status: "Applied",
    interviewDate: null
  }
];

console.log("========================================");
console.log(" JOB APPLICATION TRACKING SYSTEM");
console.log("========================================");

// Add applications with error handling
console.log("\n--- ADDING APPLICATIONS ---");

sampleApplications.forEach((application) => {
  try {
    tracker.addApplication(application);
    console.log(
      `Added: ${application.company} - ${application.position}`
    );
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
});

// Demonstrate status updates
console.log("\n--- UPDATING APPLICATION STATUS ---");

tracker.updateStatus(1, "Assessment");

console.log(
  "Tech Solutions status updated to:",
  tracker.getApplication(1).status
);

// Demonstrate custom validation error
console.log("\n--- VALIDATION CHECK ---");

try {
  tracker.addApplication({
    id: 8,
    company: "Invalid Company",
    position: "Developer",
    status: "Unknown",
    interviewDate: null
  });
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

// Display all applications
console.log("\n--- ALL JOB APPLICATIONS ---");

for (const application of tracker) {
  console.log(
    `${application.id}. ${application.company} | ` +
    `${application.position} | ${application.status}`
  );
}

// Demonstrate generator
console.log("\n--- APPLICATION GENERATOR ---");

for (const application of tracker.applicationGenerator()) {
  console.log(
    `Generator: ${application.company} - ${application.status}`
  );
}

// Display interview schedule
console.log("\n--- INTERVIEW SCHEDULE ---");

const interviews = tracker.getInterviewSchedule();

interviews.forEach((application) => {
  console.log(
    `${application.company} | ${application.position} | ` +
    `${application.interviewDate}`
  );
});

// Display applications by status
console.log("\n--- APPLICATIONS UNDER INTERVIEW ---");

tracker.getByStatus("Interview").forEach((application) => {
  console.log(`${application.company} - ${application.position}`);
});

// Sort applications by status priority
console.log("\n--- PRIORITY SORTING ---");

const sortedApplications = [...tracker].sort(
  JobTracker.compareByStatus
);

sortedApplications.forEach((application) => {
  console.log(`${application.status} | ${application.company}`);
});

// Generate final statistics
console.log("\n--- APPLICATION STATISTICS ---");

const statistics = tracker.getStatistics();

console.log("Total applications:", statistics.total);
console.log("Active applications:", statistics.active);
console.log("Offers received:", statistics.offers);
console.log("Rejected applications:", statistics.rejected);
console.log("Unique companies:", statistics.companies);
console.log("Offer rate:", `${statistics.offerRate}%`);

console.log("\n--- STATUS SUMMARY ---");

Object.entries(statistics.statusSummary).forEach(([status, count]) => {
  console.log(`${status}: ${count}`);
});

// Final system checks
console.log("\n--- SYSTEM CHECKS ---");

console.log(
  "All applications have valid statuses:",
  tracker.getAllApplications().every((application) =>
    JobTracker.VALID_STATUSES.includes(application.status)
  )
);

console.log(
  "Does the tracker contain an offer?",
  tracker.getAllApplications().some(
    (application) => application.status === "Offer"
  )
);

console.log(
  "Generator returns all applications:",
  [...tracker.applicationGenerator()].length === statistics.total
);

console.log("\nJob application tracking completed successfully.");

/**
 * OUTPUT
 [Running] node "f:\javascript-in-30-days\day26.js"
========================================
 JOB APPLICATION TRACKING SYSTEM
========================================

--- ADDING APPLICATIONS ---
Added: Tech Solutions - Frontend Developer
Added: CodeWorks - Backend Developer
Added: Digital Labs - JavaScript Developer
Added: Cloud Systems - Junior Full Stack Developer
Added: WebCraft - React Developer
Added: Innovate Tech - Node.js Developer
Added: NextGen Software - Software Engineer

--- UPDATING APPLICATION STATUS ---
Tech Solutions status updated to: Assessment

--- VALIDATION CHECK ---
ApplicationError: Invalid job application data.

--- ALL JOB APPLICATIONS ---
1. Tech Solutions | Frontend Developer | Assessment
2. CodeWorks | Backend Developer | Interview
3. Digital Labs | JavaScript Developer | Assessment
4. Cloud Systems | Junior Full Stack Developer | Rejected
5. WebCraft | React Developer | Interview
6. Innovate Tech | Node.js Developer | Offer
7. NextGen Software | Software Engineer | Applied

--- APPLICATION GENERATOR ---
Generator: Tech Solutions - Assessment
Generator: CodeWorks - Interview
Generator: Digital Labs - Assessment
Generator: Cloud Systems - Rejected
Generator: WebCraft - Interview
Generator: Innovate Tech - Offer
Generator: NextGen Software - Applied

--- INTERVIEW SCHEDULE ---
CodeWorks | Backend Developer | 2026-11-05
WebCraft | React Developer | 2026-11-08

--- APPLICATIONS UNDER INTERVIEW ---
CodeWorks - Backend Developer
WebCraft - React Developer

--- PRIORITY SORTING ---
Offer | Innovate Tech
Interview | CodeWorks
Interview | WebCraft
Assessment | Tech Solutions
Assessment | Digital Labs
Applied | NextGen Software
Rejected | Cloud Systems

--- APPLICATION STATISTICS ---
Total applications: 7
Active applications: 5
Offers received: 1
Rejected applications: 1
Unique companies: 7
Offer rate: 14.29%

--- STATUS SUMMARY ---
Assessment: 2
Interview: 2
Rejected: 1
Offer: 1
Applied: 1

--- SYSTEM CHECKS ---
All applications have valid statuses: true
Does the tracker contain an offer? true
Generator returns all applications: true

Job application tracking completed successfully.

[Done] exited with code=0 in 0.118 seconds


 */