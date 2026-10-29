
/*
  Day 22: Smart Event Scheduler & Conflict Detector
  This project validates events, detects overlapping schedules,
  filters events, and generates a daily planning report.
*/

// Sample calendar events
const events = [
  {
    id: 1,
    title: "JavaScript Practice",
    date: "2026-10-29",
    start: "09:00",
    end: "10:30",
    category: "Learning",
    priority: "High"
  },
  {
    id: 2,
    title: "Backend API Development",
    date: "2026-10-29",
    start: "10:00",
    end: "11:30",
    category: "Development",
    priority: "High"
  },
  {
    id: 3,
    title: "React Project Work",
    date: "2026-10-29",
    start: "12:00",
    end: "13:30",
    category: "Development",
    priority: "Medium"
  },
  {
    id: 4,
    title: "Lunch Break",
    date: "2026-10-29",
    start: "13:30",
    end: "14:00",
    category: "Personal",
    priority: "Low"
  },
  {
    id: 5,
    title: "Networking Fundamentals",
    date: "2026-10-29",
    start: "15:00",
    end: "16:00",
    category: "Learning",
    priority: "Medium"
  },
  {
    id: 6,
    title: "Portfolio Review",
    date: "2026-10-30",
    start: "11:00",
    end: "12:00",
    category: "Career",
    priority: "High"
  },
  {
    id: 7,
    title: "GitHub Repository Cleanup",
    date: "2026-10-29",
    start: "16:30",
    end: "17:00",
    category: "Development",
    priority: "Low"
  },
  {
    id: 8,
    title: "Invalid Event Example",
    date: "2026-10-29",
    start: "14:00",
    end: "13:00",
    category: "Testing",
    priority: "Low"
  }
];

// Convert HH:MM into minutes for reliable time comparison
const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Validate a calendar date without accepting impossible dates
const isValidDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsedDate = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
};

// Validate the event's required fields and time range
const validateEvent = (event) => {
  const validPriorities = ["High", "Medium", "Low"];

  if (
    !event.title?.trim() ||
    !isValidDate(event.date) ||
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(event.start) ||
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(event.end) ||
    !event.category?.trim() ||
    !validPriorities.includes(event.priority)
  ) {
    return false;
  }

  return toMinutes(event.end) > toMinutes(event.start);
};

// Split valid and invalid records
const validEvents = events.filter(validateEvent);
const invalidEvents = events.filter((event) => !validateEvent(event));

// Sort valid events by date, then start time
const sortedEvents = [...validEvents].sort((a, b) => {
  const dateComparison = a.date.localeCompare(b.date);

  return dateComparison || toMinutes(a.start) - toMinutes(b.start);
});

// Find events that overlap on the same date
const conflicts = [];

for (let i = 0; i < sortedEvents.length; i++) {
  for (let j = i + 1; j < sortedEvents.length; j++) {
    const first = sortedEvents[i];
    const second = sortedEvents[j];

    // Sorted dates let us stop checking when the date changes
    if (first.date !== second.date) {
      if (second.date > first.date) break;
      continue;
    }

    const overlaps =
      toMinutes(first.start) < toMinutes(second.end) &&
      toMinutes(second.start) < toMinutes(first.end);

    if (overlaps) {
      conflicts.push({
        date: first.date,
        firstEvent: first.title,
        secondEvent: second.title,
        overlapStart:
          toMinutes(first.start) > toMinutes(second.start)
            ? first.start
            : second.start,
        overlapEnd:
          toMinutes(first.end) < toMinutes(second.end)
            ? first.end
            : second.end
      });
    }
  }
}

// Calculate event duration in minutes
const getDuration = (event) =>
  toMinutes(event.end) - toMinutes(event.start);

// Generate a schedule for a selected date
const selectedDate = "2026-10-29";

const dailySchedule = sortedEvents.filter(
  (event) => event.date === selectedDate
);

// Find high-priority events
const highPriorityEvents = sortedEvents.filter(
  (event) => event.priority === "High"
);

// Calculate total scheduled time
const totalScheduledMinutes = dailySchedule.reduce(
  (total, event) => total + getDuration(event),
  0
);

// Group valid events by category
const eventsByCategory = validEvents.reduce((groups, event) => {
  groups[event.category] ??= [];
  groups[event.category].push(event);
  return groups;
}, {});

// Count events by priority
const prioritySummary = validEvents.reduce(
  (summary, event) => {
    summary[event.priority]++;
    return summary;
  },
  { High: 0, Medium: 0, Low: 0 }
);

// Format minutes as readable hours and minutes
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
};

// Display the report
console.log("========================================");
console.log(" SMART EVENT SCHEDULER");
console.log("========================================");

console.log("\n--- DATA VALIDATION ---");
console.log("Total event records:", events.length);
console.log("Valid events:", validEvents.length);
console.log("Invalid events:", invalidEvents.length);

invalidEvents.forEach((event) => {
  console.log(`Invalid: ${event.title} (${event.start} - ${event.end})`);
});

console.log("\n--- SCHEDULE FOR", selectedDate, "---");

dailySchedule.forEach((event) => {
  console.log(
    `${event.start}-${event.end} | ${event.title} | ${event.priority} priority`
  );
});

console.log("\n--- SCHEDULING CONFLICTS ---");

if (conflicts.length === 0) {
  console.log("No scheduling conflicts found.");
} else {
  conflicts.forEach((conflict, index) => {
    console.log(
      `${index + 1}. ${conflict.firstEvent} conflicts with ` +
      `${conflict.secondEvent} from ${conflict.overlapStart} ` +
      `to ${conflict.overlapEnd} on ${conflict.date}`
    );
  });
}

console.log("\n--- DAILY TIME SUMMARY ---");
console.log("Events on selected date:", dailySchedule.length);
console.log("Total scheduled time:", formatDuration(totalScheduledMinutes));

console.log("\n--- HIGH-PRIORITY EVENTS ---");
highPriorityEvents.forEach((event) => {
  console.log(`${event.date} | ${event.start} | ${event.title}`);
});

console.log("\n--- CATEGORY SUMMARY ---");

Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
  console.log(`${category}: ${categoryEvents.length} event(s)`);
});

console.log("\n--- PRIORITY SUMMARY ---");
Object.entries(prioritySummary).forEach(([priority, count]) => {
  console.log(`${priority}: ${count} event(s)`);
});

console.log("\n--- LONGEST EVENT ---");

const longestEvent = validEvents.reduce((longest, current) =>
  getDuration(current) > getDuration(longest) ? current : longest
);

console.log(
  `${longestEvent.title} - ${formatDuration(getDuration(longestEvent))}`
);

console.log("\n--- SCHEDULER CHECKS ---");
console.log(
  "All valid events have positive durations:",
  validEvents.every((event) => getDuration(event) > 0)
);
console.log(
  "Does the schedule contain conflicts?",
  conflicts.length > 0
);

console.log("\nEvent scheduling report completed successfully.");


/*
OUTPUT

[Running] node "f:\javascript-in-30-days\day22.js"
========================================
 SMART EVENT SCHEDULER
========================================

--- DATA VALIDATION ---
Total event records: 8
Valid events: 7
Invalid events: 1
Invalid: Invalid Event Example (14:00 - 13:00)

--- SCHEDULE FOR 2026-10-29 ---
09:00-10:30 | JavaScript Practice | High priority
10:00-11:30 | Backend API Development | High priority
12:00-13:30 | React Project Work | Medium priority
13:30-14:00 | Lunch Break | Low priority
15:00-16:00 | Networking Fundamentals | Medium priority
16:30-17:00 | GitHub Repository Cleanup | Low priority

--- SCHEDULING CONFLICTS ---
1. JavaScript Practice conflicts with Backend API Development from 10:00 to 10:30 on 2026-10-29

--- DAILY TIME SUMMARY ---
Events on selected date: 6
Total scheduled time: 6 hr 30 min

--- HIGH-PRIORITY EVENTS ---
2026-10-29 | 09:00 | JavaScript Practice
2026-10-29 | 10:00 | Backend API Development
2026-10-30 | 11:00 | Portfolio Review

--- CATEGORY SUMMARY ---
Learning: 2 event(s)
Development: 3 event(s)
Personal: 1 event(s)
Career: 1 event(s)

--- PRIORITY SUMMARY ---
High: 3 event(s)
Medium: 2 event(s)
Low: 2 event(s)

--- LONGEST EVENT ---
JavaScript Practice - 1 hr 30 min

--- SCHEDULER CHECKS ---
All valid events have positive durations: true
Does the schedule contain conflicts? true

Event scheduling report completed successfully.

[Done] exited with code=0 in 0.426 seconds


*/