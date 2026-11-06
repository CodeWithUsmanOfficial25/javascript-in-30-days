
 // Day 4: Smart Contact Book
 // Level: Beginner
 // Concepts: Objects, Nested Objects, Functions, Destructuring,
 // String Methods, Object.freeze(), and Array Methods.

 // 1. CREATE CONTACTS USING OBJECTS AND AN ARRAY

 // An object stores related information as key-value pairs.
 // A nested object is an object inside another object.
 // An array lets us store multiple contacts together.

const contacts = [
    {
        name: "Ali Khan",
        phone: "03001234567",
        email: "ali@example.com",
        address: {
            city: "Lahore",
            country: "Pakistan"
        }
    },
    {
        name: "Sara Ahmed",
        phone: "03111234567",
        email: "sara@example.com",
        address: {
            city: "Karachi",
            country: "Pakistan"
        }
    },
    {
        name: "Ahmed Raza",
        phone: "03221234567",
        email: "ahmed@example.com",
        address: {
            city: "Islamabad",
            country: "Pakistan"
        }
    }
];

// Use an index to access an array item.
// Use dot notation to access an object's property.
console.log("First contact:", contacts[0].name);
console.log("First contact's city:", contacts[0].address.city);


// 2. CREATE A REUSABLE FUNCTION TO DISPLAY A CONTACT

// A function groups instructions so we can reuse them.
// The parameter 'contact' receives the object passed to the function.
function displayContact(contact) {

    // If the contact is missing, stop before accessing its properties.
    if (!contact) {
        console.log("Contact not found!");
        return;
    }

    console.log("\n--- Contact Details ---");
    console.log("Name:", contact.name);
    console.log("Phone:", contact.phone);
    console.log("Email:", contact.email);
    console.log("City:", contact.address.city);
    console.log("Country:", contact.address.country);
}

// Pass the first contact object as the function argument.
displayContact(contacts[0]);


// 3. OBJECT DESTRUCTURING

// We can access properties with dot notation:
const firstName = contacts[0].name;
const firstEmail = contacts[0].email;

console.log("\nUsing dot notation:", firstName, firstEmail);

// Destructuring extracts properties into variables in one step.
// The variable names match the object property names.
const { name, email } = contacts[0];

console.log("Using destructuring:", name, email);

// Nested destructuring extracts properties from an inner object.
const {
    address: { city, country }
} = contacts[0];

console.log("Address using destructuring:", city, country);


// 4. SEARCH FOR A CONTACT

// This function accepts the name we want to find.
// toLowerCase() makes the search ignore uppercase/lowercase differences.
// find() returns the first matching contact, or undefined if none matches.
function searchContact(searchName) {
    return contacts.find(function (contact) {
        return contact.name.toLowerCase() === searchName.toLowerCase();
    });
}

console.log("\nSearching for ALI KHAN:");
displayContact(searchContact("ALI KHAN"));

// Store the search result so we can check whether it exists.
const searchResult = searchContact("Unknown Person");

if (searchResult) {
    displayContact(searchResult);
} else {
    console.log("No matching contact.");
}


// 5. UPDATE A CONTACT

// const prevents reassignment of the variable 'sara'.
// It does not prevent changing properties of the object it references.
const sara = searchContact("Sara Ahmed");

if (sara) {
    // Update properties on the existing contact object.
    sara.phone = "03119876543";
    sara.address.city = "Multan";

    console.log("\nUpdated Sara's contact:");
    displayContact(sara);
}

// sara refers to the same object stored inside the contacts array,
// so these updates are also visible in contacts.


// 6. FREEZE A CONTACT

// Object.freeze() prevents direct changes to an object's properties.
// Freezing is shallow: it does not automatically freeze nested objects.
const ahmed = searchContact("Ahmed Raza");

Object.freeze(ahmed);
Object.freeze(ahmed.address); // Freeze the nested address separately.

// Object.isFrozen() checks whether each object is frozen.
console.log("\nIs Ahmed's contact frozen?", Object.isFrozen(ahmed));
console.log("Is Ahmed's address frozen?", Object.isFrozen(ahmed.address));

// These assignments do not change the frozen properties in non-strict mode.
// In strict mode, attempting these assignments throws a TypeError.
ahmed.phone = "09999999999";
ahmed.address.city = "Peshawar";

console.log("Ahmed's phone after attempted update:", ahmed.phone);
console.log("Ahmed's city after attempted update:", ahmed.address.city);


// 7. USEFUL ARRAY METHODS: find(), filter(), AND map()

// find() returns the first item that matches a condition.
const ali = contacts.find(function (contact) {
    return contact.name === "Ali Khan";
});

console.log("\nFound contact:", ali.name);

// filter() returns a new array containing every matching item.
// Here, it finds contacts who live in Lahore.
const lahoreContacts = contacts.filter(function (contact) {
    return contact.address.city === "Lahore";
});

console.log("Number of contacts in Lahore:", lahoreContacts.length);

// map() creates a new array by transforming each item.
// Here, each contact becomes a simpler object for the table.
const contactSummary = contacts.map(function (contact) {
    return {
        Name: contact.name,
        Phone: contact.phone,
        Email: contact.email,
        City: contact.address.city,
        Country: contact.address.country
    };
});

console.log("\nAll contacts:");
console.table(contactSummary);


// 8. DISPLAY THE CONTACT BOOK SUMMARY

// The length property tells us how many items are in the array.
console.log("Total contacts:", contacts.length);


/*
EXPECTED OUTPUT
(The console.table() section is shown as a table in the terminal.)

First contact: Ali Khan
First contact's city: Lahore

--- Contact Details ---
Name: Ali Khan
Phone: 03001234567
Email: ali@example.com
City: Lahore
Country: Pakistan

Using dot notation: Ali Khan ali@example.com
Using destructuring: Ali Khan ali@example.com
Address using destructuring: Lahore Pakistan

Searching for ALI KHAN:

--- Contact Details ---
Name: Ali Khan
Phone: 03001234567
Email: ali@example.com
City: Lahore
Country: Pakistan
No matching contact.

Updated Sara's contact:

--- Contact Details ---
Name: Sara Ahmed
Phone: 03119876543
Email: sara@example.com
City: Multan
Country: Pakistan

Is Ahmed's contact frozen? true
Is Ahmed's address frozen? true
Ahmed's phone after attempted update: 03221234567
Ahmed's city after attempted update: Islamabad

Found contact: Ali Khan
Number of contacts in Lahore: 1

All contacts:
The table contains:
Ali Khan   | 03001234567 | ali@example.com   | Lahore    | Pakistan
Sara Ahmed | 03119876543 | sara@example.com  | Multan    | Pakistan
Ahmed Raza | 03221234567 | ahmed@example.com | Islamabad | Pakistan

Total contacts: 3
*/
