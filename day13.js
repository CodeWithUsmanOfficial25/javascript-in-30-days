
// Day 13: Employee Payroll Management System
// Level: Intermediate
// Concepts: ES6 Classes, Constructors, Inheritance, super(),
// Method Overriding, Getters, Setters, Static Methods, instanceof.

// 1. CREATE THE BASE EMPLOYEE CLASS
// A class defines the properties and methods its objects can use.
class Employee {
    // A static property belongs to the class itself.
    static employeeCount = 0;

    constructor(name, baseSalary) {
        this._name = name;
        this.baseSalary = baseSalary;

        // Count every employee created through this class or a subclass.
        Employee.employeeCount++;
    }

    // A getter allows us to read a property through a method-like interface.
    get name() {
        return this._name;
    }

    // A setter lets us validate a value before updating the property.
    set name(newName) {
        if (newName.trim() === "") {
            console.log("Employee name cannot be empty.");
            return;
        }

        this._name = newName;
    }

    // This method can be inherited or overridden by child classes.
    calculateSalary() {
        return this.baseSalary;
    }

    getDetails() {
        return `Employee: ${this.name}`;
    }

    // Static methods are called on the class, not an individual instance.
    static getEmployeeCount() {
        return Employee.employeeCount;
    }
}


// 2. CREATE A FULL-TIME EMPLOYEE CLASS
// extends establishes inheritance from Employee.
// super() calls the parent constructor.
class FullTimeEmployee extends Employee {
    constructor(name, baseSalary, bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }

    // Override the inherited method to include the bonus.
    calculateSalary() {
        return this.baseSalary + this.bonus;
    }
}


// 3. CREATE A CONTRACT EMPLOYEE CLASS
// This class also inherits shared features from Employee.
class ContractEmployee extends Employee {
    constructor(name, hourlyRate, hoursWorked) {
        // Contract employees calculate pay from hours, not a base salary.
        super(name, 0);
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
    }

    // Override the salary calculation for contract work.
    calculateSalary() {
        return this.hourlyRate * this.hoursWorked;
    }
}


// 4. CREATE EMPLOYEE OBJECTS
const fullTimeEmployee = new FullTimeEmployee(
    "Usman",
    60000,
    10000
);

const contractEmployee = new ContractEmployee(
    "Ali",
    1500,
    80
);


// 5. DISPLAY EMPLOYEE DETAILS AND PAY
console.log("--- EMPLOYEE PAYROLL ---");

console.log(fullTimeEmployee.getDetails());
console.log("Monthly salary: PKR", fullTimeEmployee.calculateSalary());

console.log(contractEmployee.getDetails());
console.log("Monthly salary: PKR", contractEmployee.calculateSalary());


// 6. USE A SETTER TO UPDATE AN EMPLOYEE NAME
// The setter validates the new value before changing the name.
fullTimeEmployee.name = "Usman Elahi";

console.log("\n--- UPDATED EMPLOYEE ---");
console.log("Updated name:", fullTimeEmployee.name);

// Demonstrate validation with an empty name.
fullTimeEmployee.name = "   ";


// 7. USE STATIC METHODS AND INSTANCE CHECKS
// Static methods are accessed through the class name.
console.log("\n--- PAYROLL SUMMARY ---");
console.log("Total employees:", Employee.getEmployeeCount());

// instanceof checks whether an object belongs to a class
// or inherits from its prototype.
console.log(
    "Is full-time employee an Employee?",
    fullTimeEmployee instanceof Employee
);

console.log(
    "Is Ali a ContractEmployee?",
    contractEmployee instanceof ContractEmployee
);

/*
 OUTPUT

--- EMPLOYEE PAYROLL ---
Employee: Usman
Monthly salary: PKR 70000
Employee: Ali
Monthly salary: PKR 120000

--- UPDATED EMPLOYEE ---
Updated name: Usman Elahi
Employee name cannot be empty.

--- PAYROLL SUMMARY ---
Total employees: 2
Is full-time employee an Employee? true
Is Ali a ContractEmployee? true

*/
