
const students = [
    {
        name: "Usman",
        marks: {
            English: 85,
            Mathematics: 92,
            Computer: 95
        }
    },
    {
        name: "Muzamil",
        marks: {
            English: 78,
            Mathematics: 81,
            Computer: 88
        }
    },
    {
        name: "Ali",
        marks: {
            English: 45,
            Mathematics: 38,
            Computer: 52
        }
    }
];

// Calculate total marks
function calculateTotal(marks) {
    return marks.English + marks.Mathematics + marks.Computer;
}

// Calculate percentage
function calculatePercentage(total) {
    return (total / 300) * 100;
}

// Determine grade
function calculateGrade(percentage) {
    if (percentage >= 90) {
        return "A+";
    } else if (percentage >= 80) {
        return "A";
    } else if (percentage >= 70) {
        return "B";
    } else if (percentage >= 60) {
        return "C";
    } else if (percentage >= 50) {
        return "D";
    } else {
        return "F";
    }
}

// Check pass or fail
function checkResult(marks) {
    if (
        marks.English >= 40 &&
        marks.Mathematics >= 40 &&
        marks.Computer >= 40
    ) {
        return "PASS";
    } else {
        return "FAIL";
    }
}

// Display each student's result
function displayResult(student) {
    const total = calculateTotal(student.marks);
    const percentage = calculatePercentage(total);
    const grade = calculateGrade(percentage);
    const result = checkResult(student.marks);

    console.log("================================");
    console.log("       STUDENT RESULT");
    console.log("================================");
    console.log("Name:", student.name);
    console.log("English:", student.marks.English);
    console.log("Mathematics:", student.marks.Mathematics);
    console.log("Computer:", student.marks.Computer);
    console.log("Total Marks:", total, "/ 300");
    console.log("Percentage:", percentage.toFixed(2) + "%");
    console.log("Grade:", grade);
    console.log("Result:", result);
    console.log("================================\n");
}

// Find the student with the highest percentage
function findTopStudent(students) {
    let topStudent = students[0];

    for (let i = 1; i < students.length; i++) {
        const currentPercentage = calculatePercentage(
            calculateTotal(students[i].marks)
        );

        const topPercentage = calculatePercentage(
            calculateTotal(topStudent.marks)
        );

        if (currentPercentage > topPercentage) {
            topStudent = students[i];
        }
    }

    return topStudent;
}

// Print all student results
for (const student of students) {
    displayResult(student);
}

// Print class topper
const topper = findTopStudent(students);

const topperTotal = calculateTotal(topper.marks);
const topperPercentage = calculatePercentage(topperTotal);

console.log("******** CLASS TOPPER ********");
console.log("Name:", topper.name);
console.log("Total Marks:", topperTotal, "/ 300");
console.log("Percentage:", topperPercentage.toFixed(2) + "%");
console.log("******************************");

/*
EXPECTED OUTPUT:

================================
       STUDENT RESULT
================================
Name: Usman
English: 85
Mathematics: 92
Computer: 95
Total Marks: 272 / 300
Percentage: 90.67%
Grade: A+
Result: PASS
================================

================================
       STUDENT RESULT
================================
Name: Muzamil
English: 78
Mathematics: 81
Computer: 88
Total Marks: 247 / 300
Percentage: 82.33%
Grade: A
Result: PASS
================================

================================
       STUDENT RESULT
================================
Name: Ali
English: 45
Mathematics: 38
Computer: 52
Total Marks: 135 / 300
Percentage: 45.00%
Grade: F
Result: FAIL
================================

******** CLASS TOPPER ********
Name: Usman
Total Marks: 272 / 300
Percentage: 90.67%
******************************
*/
