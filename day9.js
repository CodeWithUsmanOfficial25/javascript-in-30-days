
 // Day 8: Smart Profile & Data Manager
 // Level: Beginner to Intermediate
 // Concepts: Rest Parameters, Spread Syntax, Array Copying,
 // Object Copying, Object Destructuring, Nested Destructuring,
 // Renaming Properties, and Default Values.


// 1. REST PARAMETERS
// The ...skills parameter collects multiple arguments
// into a single array.
function createProfile(name, age, ...skills) {
    return {
        name: name,
        age: age,
        skills: skills
    };
}

const newProfile = createProfile(
    "Usman",
    20,
    "JavaScript",
    "HTML",
    "CSS"
);

console.log("--- NEW PROFILE ---");
console.log(newProfile);


// 2. SPREAD SYNTAX WITH ARRAYS
// Spread syntax (...) expands the elements of an array.
// It lets us combine arrays without changing the originals.
const frontendSkills = ["HTML", "CSS", "JavaScript"];
const backendSkills = ["Node.js", "Express", "MySQL"];

const allSkills = [...frontendSkills, ...backendSkills];

console.log("\n--- COMBINED SKILLS ---");
console.log(allSkills);


// 3. COPYING AN ARRAY WITH SPREAD
// Copying with [...] creates a new array.
// Changing the copy does not change the original array.
const originalTasks = ["Learn JS", "Practise Git"];
const updatedTasks = [...originalTasks, "Build a project"];

console.log("\n--- ARRAY COPY ---");
console.log("Original tasks:", originalTasks);
console.log("Updated tasks:", updatedTasks);


// 4. SPREAD SYNTAX WITH OBJECTS
// We can copy an object and override selected properties.
// Properties written later take precedence over earlier ones.
const originalUser = {
    name: "Usman",
    role: "Student",
    city: "Sargodha"
};

const updatedUser = {
    ...originalUser,
    role: "Full Stack Developer"
};

console.log("\n--- UPDATED USER ---");
console.log("Original user:", originalUser);
console.log("Updated user:", updatedUser);


// 5. OBJECT DESTRUCTURING WITH RENAMING
// Destructuring extracts object properties into variables.
// The colon lets us give a property a different variable name.
const student = {
    fullName: "Usman Elahi",
    age: 20,
    course: "Computer Science"
};

const {
    fullName: studentName,
    course: enrolledCourse
} = student;

console.log("\n--- DESTRUCTURED DATA ---");
console.log("Student name:", studentName);
console.log("Course:", enrolledCourse);


// 6. NESTED DESTRUCTURING
// Nested destructuring extracts values from an object inside another object.
const employee = {
    name: "Ali",
    job: {
        title: "Backend Intern",
        department: "Development"
    }
};

const {
    job: { title, department }
} = employee;

console.log("\n--- NESTED DESTRUCTURING ---");
console.log("Job title:", title);
console.log("Department:", department);


// 7. DEFAULT VALUES IN DESTRUCTURING
// A default value is used when a property is undefined.
const account = {
    username: "usman_dev",
    email: "usman@example.com"
};

const {
    username,
    country = "Pakistan",
    accountType = "Free"
} = account;

console.log("\n--- DEFAULT VALUES ---");
console.log("Username:", username);
console.log("Country:", country);
console.log("Account type:", accountType);


// 8. REST SYNTAX IN OBJECT DESTRUCTURING
// Here, ...otherDetails collects the remaining properties
// into a new object after username has been extracted.
const userAccount = {
    username: "usman_dev",
    email: "usman@example.com",
    city: "Sargodha",
    role: "Developer"
};

const { username: accountName, ...otherDetails } = userAccount;

console.log("\n--- REMAINING OBJECT PROPERTIES ---");
console.log("Username:", accountName);
console.log("Other details:", otherDetails);


// 9. REST PARAMETERS WITH A REAL-WORLD CALCULATION
// Rest parameters allow a function to accept any number of prices.
function calculateTotal(...prices) {
    let total = 0;

    for (const price of prices) {
        total += price;
    }

    return total;
}

const orderTotal = calculateTotal(1200, 800, 500, 300);

console.log("\n--- ORDER TOTAL ---");
console.log("Total price:", orderTotal);


// 10. SPREAD SYNTAX WITH FUNCTION ARGUMENTS
// Spread expands an array into separate function arguments.
const marks = [85, 92, 78, 95];

const highestMark = Math.max(...marks);
const lowestMark = Math.min(...marks);

console.log("\n--- MARKS ANALYSIS ---");
console.log("Highest mark:", highestMark);
console.log("Lowest mark:", lowestMark);


/*
 OUTPUT

--- NEW PROFILE ---
{ name: 'Usman', age: 20, skills: [ 'JavaScript', 'HTML', 'CSS' ] }

--- COMBINED SKILLS ---
[ 'HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MySQL' ]

--- ARRAY COPY ---
Original tasks: [ 'Learn JS', 'Practise Git' ]
Updated tasks: [ 'Learn JS', 'Practise Git', 'Build a project' ]

--- UPDATED USER ---
Original user: { name: 'Usman', role: 'Student', city: 'Sargodha' }
Updated user: { name: 'Usman', role: 'Full Stack Developer', city: 'Sargodha' }

--- DESTRUCTURED DATA ---
Student name: Usman Elahi
Course: Computer Science

--- NESTED DESTRUCTURING ---
Job title: Backend Intern
Department: Development

--- DEFAULT VALUES ---
Username: usman_dev
Country: Pakistan
Account type: Free

--- REMAINING OBJECT PROPERTIES ---
Username: usman_dev
Other details: { email: 'usman@example.com', city: 'Sargodha', role: 'Developer' }

--- ORDER TOTAL ---
Total price: 2800

--- MARKS ANALYSIS ---
Highest mark: 95
Lowest mark: 78
*/
