
// Day 12: Prototype Inheritance Manager
// Level: Intermediate
// Concepts: Prototypes, Prototype Chain, Object.create(),
// Object.hasOwn(), Method Inheritance, Method Overriding,
// Object.isPrototypeOf(), and instanceof.

// 1. CREATE A PARENT OBJECT
// This object contains properties and methods shared by vehicles.
const vehiclePrototype = {
    start() {
        return `${this.brand} ${this.model} is starting.`;
    },

    stop() {
        return `${this.brand} ${this.model} has stopped.`;
    },

    getDetails() {
        return `${this.brand} ${this.model} (${this.year})`;
    }
};


// 2. CREATE AN OBJECT THAT INHERITS FROM THE PROTOTYPE
// Object.create() creates a new object with the specified prototype.
// The vehicle object can use methods from vehiclePrototype.
const vehicle = Object.create(vehiclePrototype);

vehicle.brand = "Toyota";
vehicle.model = "Corolla";
vehicle.year = 2024;

console.log("--- VEHICLE INFORMATION ---");
console.log(vehicle.getDetails());
console.log(vehicle.start());
console.log(vehicle.stop());


// 3. CHECK OWN AND INHERITED PROPERTIES
// Own properties belong directly to the object.
// Inherited methods are available through its prototype chain.
console.log("\n--- PROPERTY CHECKS ---");
console.log("Has its own brand:", Object.hasOwn(vehicle, "brand"));
console.log("Has its own start method:", Object.hasOwn(vehicle, "start"));
console.log(
    "Prototype provides start:",
    vehiclePrototype.isPrototypeOf(vehicle)
);


// 4. CREATE A CHILD OBJECT
// This object inherits vehicle properties and methods.
// It also defines its own additional property.
const car = Object.create(vehiclePrototype);

car.brand = "Honda";
car.model = "Civic";
car.year = 2025;
car.doors = 4;

console.log("\n--- CHILD OBJECT ---");
console.log(car.getDetails());
console.log("Number of doors:", car.doors);
console.log(car.start());


// 5. OVERRIDE AN INHERITED METHOD
// A child object can define a method with the same name
// as an inherited method. Its own method takes precedence.
car.start = function () {
    return `${this.brand} ${this.model} is starting with a push button.`;
};

console.log("\n--- METHOD OVERRIDING ---");
console.log(car.start());

// The original prototype method remains unchanged.
console.log(vehiclePrototype.start.call(vehicle));


// 6. CREATE A SPECIALIZED ELECTRIC CAR
// electricCarPrototype inherits methods from vehiclePrototype.
// It adds a method specifically for electric vehicles.
const electricCarPrototype = Object.create(vehiclePrototype);

electricCarPrototype.charge = function () {
    return `${this.brand} ${this.model} is charging.`;
};

const electricCar = Object.create(electricCarPrototype);

electricCar.brand = "Tesla";
electricCar.model = "Model 3";
electricCar.year = 2026;

console.log("\n--- ELECTRIC CAR ---");
console.log(electricCar.getDetails());
console.log(electricCar.start());
console.log(electricCar.charge());


// 7. EXPLORE THE PROTOTYPE CHAIN
// JavaScript searches the prototype chain when a property
// is not found directly on the object.
console.log("\n--- PROTOTYPE CHAIN ---");
console.log(
    "Inherits electric-car methods:",
    electricCarPrototype.isPrototypeOf(electricCar)
);
console.log(
    "Inherits vehicle methods:",
    vehiclePrototype.isPrototypeOf(electricCar)
);
console.log(
    "Has its own charge method:",
    Object.hasOwn(electricCar, "charge")
);


// 8. CHECK instanceof
// instanceof checks whether a constructor's prototype
// appears in an object's prototype chain.
function Vehicle(brand) {
    this.brand = brand;
}

const myVehicle = new Vehicle("Suzuki");

console.log("\n--- INSTANCE CHECK ---");
console.log("Is a Vehicle instance:", myVehicle instanceof Vehicle);
console.log("Vehicle brand:", myVehicle.brand);

/*
 OUTPUT

--- VEHICLE INFORMATION ---
Toyota Corolla (2024)
Toyota Corolla is starting.
Toyota Corolla has stopped.

--- PROPERTY CHECKS ---
Has its own brand: true
Has its own start method: false
Prototype provides start: true

--- CHILD OBJECT ---
Honda Civic (2025)
Number of doors: 4
Honda Civic is starting.

--- METHOD OVERRIDING ---
Honda Civic is starting with a push button.
Toyota Corolla is starting.

--- ELECTRIC CAR ---
Tesla Model 3 (2026)
Tesla Model 3 is starting.
Tesla Model 3 is charging.

--- PROTOTYPE CHAIN ---
Inherits electric-car methods: true
Inherits vehicle methods: true
Has its own charge method: false

--- INSTANCE CHECK ---
Is a Vehicle instance: true
Vehicle brand: Suzuki

*/
