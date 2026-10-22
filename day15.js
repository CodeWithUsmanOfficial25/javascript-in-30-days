
// Day 15: Student Record Management System
// Concepts: Array Methods, Searching, Filtering, Reduce, Validation, Error Handling

// Students ka record store kar rahe hain, jise hum different operations mein use karein ge.
const students = [
    { id: 101, name: "Usman", marks: 85 },
    { id: 102, name: "Ali", marks: 72 },
    { id: 103, name: "Ahmed", marks: 91 },
    { id: 104, name: "Hassan", marks: 38 },
    { id: 105, name: "Hamza", marks: 64 }
];

// Marks ke according grade return hoga.
function calculateGrade(marks) {
    if (typeof marks !== "number" || !Number.isFinite(marks) ||
        marks < 0 || marks > 100) {
        throw new Error("Marks must be between 0 and 100.");
    }

    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";

    return "F";
}

// Student pass hai ya fail, ye function decide karega.
function getResult(marks) {
    return calculateGrade(marks) === "F" ? "Fail" : "Pass";
}

// New student add karne se pehle uska data validate karo.
function addStudent(name, marks) {
    if (typeof name !== "string" || name.trim() === "") {
        throw new Error("Student name cannot be empty.");
    }

    calculateGrade(marks);

    const newId = students.length > 0
        ? Math.max(...students.map(student => student.id)) + 1
        : 101;

    const newStudent = {
        id: newId,
        name: name.trim(),
        marks
    };

    students.push(newStudent);
    return newStudent;
}

// ID ki help se specific student ka record find kar sakte hain.
function findStudentById(id) {
    return students.find(student => student.id === id) || null;
}

// Naam ka koi part match ho to related students return honge.
function searchStudentsByName(searchName) {
    const searchTerm = searchName.trim().toLowerCase();

    if (!searchTerm) return [];

    return students.filter(student =>
        student.name.toLowerCase().includes(searchTerm)
    );
}

// Har student ke record ke saath grade aur result bhi add karo.
function generateReports() {
    return students.map(student => ({
        ...student,
        grade: calculateGrade(student.marks),
        result: getResult(student.marks)
    }));
}

// Class ke average marks calculate kar rahe hain.
function calculateAverage() {
    if (students.length === 0) return 0;

    const totalMarks = students.reduce(
        (total, student) => total + student.marks,
        0
    );

    return totalMarks / students.length;
}

// Highest marks wale student ko find karo.
function getTopStudent() {
    if (students.length === 0) return null;

    return students.reduce((top, student) =>
        student.marks > top.marks ? student : top
    );
}

// Lowest marks wale student ka record return hoga.
function getLowestStudent() {
    if (students.length === 0) return null;

    return students.reduce((lowest, student) =>
        student.marks < lowest.marks ? student : lowest
    );
}

// Records ko readable format mein display karne ke liye.
function displayStudents(studentList) {
    if (studentList.length === 0) {
        console.log("No student records found.");
        return;
    }

    studentList.forEach(student => {
        console.log(
            `ID: ${student.id} | Name: ${student.name} | Marks: ${student.marks}`
        );
    });
}


// 1. DISPLAY ALL STUDENTS
console.log("========== STUDENT RECORDS ==========");
displayStudents(students);


// 2. DISPLAY STUDENT REPORTS
console.log("\n========== STUDENT REPORTS ==========");

generateReports().forEach(student => {
    console.log(
        `${student.name} | Marks: ${student.marks} | ` +
        `Grade: ${student.grade} | Result: ${student.result}`
    );
});


// 3. SEARCH BY STUDENT ID
console.log("\n========== SEARCH BY ID ==========");

const searchedStudent = findStudentById(103);

if (searchedStudent) {
    console.log("Student found:", searchedStudent.name);
} else {
    console.log("Student not found.");
}


// 4. SEARCH BY NAME
console.log("\n========== SEARCH BY NAME ==========");
displayStudents(searchStudentsByName("ha"));


// 5. FILTER PASSED AND FAILED STUDENTS
console.log("\n========== PASSED STUDENTS ==========");
displayStudents(students.filter(student => getResult(student.marks) === "Pass"));

console.log("\n========== FAILED STUDENTS ==========");
displayStudents(students.filter(student => getResult(student.marks) === "Fail"));


// 6. ADD A NEW STUDENT
console.log("\n========== ADD NEW STUDENT ==========");

try {
    const newStudent = addStudent("Zain", 78);
    console.log("Student added successfully:", newStudent.name);
} catch (error) {
    console.log("Error:", error.message);
}

// Invalid input bhi test kar lete hain.
try {
    addStudent("", 110);
} catch (error) {
    console.log("Could not add student:", error.message);
}


// 7. CLASS STATISTICS
console.log("\n========== CLASS STATISTICS ==========");

const topStudent = getTopStudent();
const lowestStudent = getLowestStudent();

console.log("Total students:", students.length);
console.log(
    "Passed students:",
    students.filter(student => getResult(student.marks) === "Pass").length
);
console.log(
    "Failed students:",
    students.filter(student => getResult(student.marks) === "Fail").length
);
console.log("Class average:", calculateAverage().toFixed(2));

if (topStudent) {
    console.log("Top student:", topStudent.name, "| Marks:", topStudent.marks);
}

if (lowestStudent) {
    console.log("Lowest marks:", lowestStudent.name, "| Marks:", lowestStudent.marks);
}


/*
 OUTPUT

 ========== STUDENT RECORDS ==========
ID: 101 | Name: Usman | Marks: 85
ID: 102 | Name: Ali | Marks: 72
ID: 103 | Name: Ahmed | Marks: 91
ID: 104 | Name: Hassan | Marks: 38
ID: 105 | Name: Hamza | Marks: 64

========== STUDENT REPORTS ==========
Usman | Marks: 85 | Grade: A | Result: Pass
Ali | Marks: 72 | Grade: B | Result: Pass
Ahmed | Marks: 91 | Grade: A+ | Result: Pass
Hassan | Marks: 38 | Grade: F | Result: Fail
Hamza | Marks: 64 | Grade: C | Result: Pass

========== SEARCH BY ID ==========
Student found: Ahmed

========== SEARCH BY NAME ==========
ID: 104 | Name: Hassan | Marks: 38
ID: 105 | Name: Hamza | Marks: 64

========== PASSED STUDENTS ==========
ID: 101 | Name: Usman | Marks: 85
ID: 102 | Name: Ali | Marks: 72
ID: 103 | Name: Ahmed | Marks: 91
ID: 105 | Name: Hamza | Marks: 64

========== FAILED STUDENTS ==========
ID: 104 | Name: Hassan | Marks: 38

========== ADD NEW STUDENT ==========
Student added successfully: Zain
Could not add student: Student name cannot be empty.

========== CLASS STATISTICS ==========
Total students: 6
Passed students: 5
Failed students: 1
Class average: 71.33
Top student: Ahmed | Marks: 91
Lowest marks: Hassan | Marks: 38

[Done] exited with code=0 in 0.636 seconds

*/
