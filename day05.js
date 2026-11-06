
// Day 5: Variable Scope Explorer
// Level: Beginner
// Concepts: Global/Outer Scope, Function Scope, Block Scope,
// Lexical Scope, Variable Shadowing, and Scope Chain.

// 1. OUTER SCOPE
// This variable is declared outside the functions below.
// It can be accessed by code inside these functions.
const applicationName = "Scope Explorer";

console.log("Application:", applicationName);


// 2. FUNCTION SCOPE
// A variable declared with var inside a function
// can be accessed throughout that function.
function demonstrateFunctionScope() {
    var functionMessage = "I belong to the function";

    console.log("\n--- FUNCTION SCOPE ---");
    console.log(functionMessage);
}

demonstrateFunctionScope();

// functionMessage cannot be accessed outside its function.
// Keeping variables inside functions prevents accidental access
// from unrelated parts of the program.


// 3. BLOCK SCOPE: LET, CONST, AND VAR
// A block is code inside curly braces {}.
// let and const are limited to the block where they are declared.
// var is function-scoped, so it can be accessed outside this block
// as long as we remain inside the same function.
function demonstrateBlockScope() {
    if (true) {
        var varMessage = "var can leave this block";
        let letMessage = "let stays inside this block";
        const constMessage = "const stays inside this block";

        console.log("\n--- INSIDE THE BLOCK ---");
        console.log(varMessage);
        console.log(letMessage);
        console.log(constMessage);
    }

    // varMessage remains accessible because var is function-scoped.
    console.log("\n--- OUTSIDE THE BLOCK ---");
    console.log(varMessage);

    // letMessage and constMessage cannot be accessed here.
    // We don't reference them because that would cause a ReferenceError.
}

demonstrateBlockScope();


// 4. LEXICAL SCOPE
// An inner function can access variables declared in its outer function.
// This is called lexical scope.
function outerFunction() {
    const userName = "Usman";

    function innerFunction() {
        console.log("\n--- LEXICAL SCOPE ---");
        console.log("User name:", userName);
    }

    innerFunction();
}

outerFunction();


// 5. VARIABLE SHADOWING
// A variable inside a smaller scope can use the same name
// as a variable in an outer scope.
// The inner variable temporarily takes precedence in that scope.
const message = "Outer message";

function demonstrateShadowing() {
    const message = "Inner message";

    console.log("\n--- VARIABLE SHADOWING ---");
    console.log(message);
}

demonstrateShadowing();

// The outer variable has not changed.
console.log("Outside the function:", message);


// 6. SCOPE CHAIN
// JavaScript looks for a variable in the current scope first.
// If it isn't found there, it checks the outer scope.
const country = "Pakistan";

function showScopeChain() {
    const city = "Sargodha";

    function showLocation() {
        const area = "Punjab";

        // area is found in this function.
        // city and country are found in outer scopes.
        console.log("\n--- SCOPE CHAIN ---");
        console.log("Area:", area);
        console.log("City:", city);
        console.log("Country:", country);
    }

    showLocation();
}

showScopeChain();

/*
EXPECTED OUTPUT

Application: Scope Explorer

--- FUNCTION SCOPE ---
I belong to the function

--- INSIDE THE BLOCK ---
var can leave this block
let stays inside this block
const stays inside this block

--- OUTSIDE THE BLOCK ---
var can leave this block

--- LEXICAL SCOPE ---
User name: Usman

--- VARIABLE SHADOWING ---
Inner message
Outside the function: Outer message

--- SCOPE CHAIN ---
Area: Punjab
City: Sargodha
Country: Pakistan
*/
