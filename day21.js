
/*
 * Day 21: Smart File Organizer
 * Concepts: Map, Set, Object Methods, String Methods,
 * Array Methods, Data Validation, Grouping, Duplicate Detection,
 * Sorting, and Report Generation.
 *
 * This project simulates file organization without changing
 * any files on your computer.
 */

// Sample files collected from different folders.
const files = [
    { id: 1, name: "resume.pdf", size: 450, folder: "Downloads" },
    { id: 2, name: "profile.png", size: 1200, folder: "Desktop" },
    { id: 3, name: "project.js", size: 32, folder: "Coding" },
    { id: 4, name: "report.docx", size: 780, folder: "Documents" },
    { id: 5, name: "holiday.jpg", size: 2400, folder: "Pictures" },
    { id: 6, name: "budget.xlsx", size: 650, folder: "Documents" },
    { id: 7, name: "intro.mp4", size: 15000, folder: "Downloads" },
    { id: 8, name: "backup.zip", size: 8200, folder: "Downloads" },
    { id: 9, name: "app.js", size: 45, folder: "Coding" },
    { id: 10, name: "notes.txt", size: 12, folder: "Desktop" },
    { id: 11, name: "resume.pdf", size: 450, folder: "Desktop" },
    { id: 12, name: "song.mp3", size: 5100, folder: "Music" },
    { id: 13, name: "logo.svg", size: 85, folder: "Design" },
    { id: 14, name: "presentation.pptx", size: 2300, folder: "Documents" },
    { id: 15, name: "archive", size: 300, folder: "Downloads" }
];

// File extensions mapped to their target categories.
const fileCategories = {
    pdf: "Documents",
    doc: "Documents",
    docx: "Documents",
    txt: "Documents",
    rtf: "Documents",
    xls: "Spreadsheets",
    xlsx: "Spreadsheets",
    csv: "Spreadsheets",
    ppt: "Presentations",
    pptx: "Presentations",
    jpg: "Images",
    jpeg: "Images",
    png: "Images",
    gif: "Images",
    svg: "Images",
    mp4: "Videos",
    mov: "Videos",
    mp3: "Audio",
    wav: "Audio",
    zip: "Archives",
    rar: "Archives",
    js: "Code",
    html: "Code",
    css: "Code",
    json: "Code"
};

// Extract the extension from a filename.
function getExtension(filename) {
    const lastDot = filename.lastIndexOf(".");

    if (lastDot <= 0 || lastDot === filename.length - 1) {
        return "unknown";
    }

    return filename.slice(lastDot + 1).toLowerCase();
}

// Validate file metadata before processing.
function isValidFile(file) {
    return (
        Number.isInteger(file.id) &&
        file.id > 0 &&
        typeof file.name === "string" &&
        file.name.trim().length > 0 &&
        typeof file.folder === "string" &&
        file.folder.trim().length > 0 &&
        Number.isFinite(file.size) &&
        file.size >= 0
    );
}

// Reject invalid records before organizing the collection.
const validFiles = files.filter(isValidFile);
const invalidFiles = files.filter(file => !isValidFile(file));

// Use a Set to identify unique file extensions.
const extensions = new Set(
    validFiles.map(file => getExtension(file.name))
);

// Use a Map to group files by their target category.
const organizedFiles = new Map();

// Track how often each filename appears.
const filenameCounts = new Map();

validFiles.forEach(file => {
    const extension = getExtension(file.name);
    const category = fileCategories[extension] || "Other";

    // Create the category only when it doesn't exist.
    if (!organizedFiles.has(category)) {
        organizedFiles.set(category, []);
    }

    // Add the file to its matching category.
    organizedFiles.get(category).push({
        ...file,
        extension,
        category
    });

    // Count repeated filenames without changing the original data.
    const normalizedName = file.name.trim().toLowerCase();

    filenameCounts.set(
        normalizedName,
        (filenameCounts.get(normalizedName) || 0) + 1
    );
});

// Identify filenames that appear more than once.
const duplicateNames = new Set(
    [...filenameCounts.entries()]
        .filter(([, count]) => count > 1)
        .map(([name]) => name)
);

// Find individual records whose names are duplicated.
const duplicateFiles = validFiles.filter(file =>
    duplicateNames.has(file.name.trim().toLowerCase())
);

// Calculate the total storage used by valid files.
const totalSize = validFiles.reduce(
    (total, file) => total + file.size,
    0
);

// Sort files inside every category from largest to smallest.
organizedFiles.forEach(categoryFiles => {
    categoryFiles.sort((a, b) => b.size - a.size);
});

// Find the largest file.
const largestFile = validFiles.reduce(
    (largest, file) => file.size > largest.size ? file : largest,
    validFiles[0]
);

// Generate category summaries.
const categorySummary = [...organizedFiles.entries()]
    .map(([category, categoryFiles]) => ({
        category,
        fileCount: categoryFiles.length,
        totalSize: categoryFiles.reduce(
            (total, file) => total + file.size,
            0
        )
    }))
    .sort((a, b) => b.totalSize - a.totalSize);

// Format file sizes for readable output.
function formatSize(size) {
    if (size >= 1024) {
        return `${(size / 1024).toFixed(2)} MB`;
    }

    return `${size} KB`;
}

// Display the complete organization report.
console.log("========================================");
console.log("         SMART FILE ORGANIZER");
console.log("========================================");

console.log(`Total files scanned: ${files.length}`);
console.log(`Valid files: ${validFiles.length}`);
console.log(`Invalid files: ${invalidFiles.length}`);
console.log(`Unique extensions: ${extensions.size}`);
console.log(`Categories created: ${organizedFiles.size}`);
console.log(`Total storage: ${formatSize(totalSize)}`);

console.log("\n--- ORGANIZED FILES ---");

organizedFiles.forEach((categoryFiles, category) => {
    console.log(`\n${category} (${categoryFiles.length} files)`);

    categoryFiles.forEach(file => {
        console.log(
            `  - ${file.name} | ${formatSize(file.size)} | ` +
            `From: ${file.folder}`
        );
    });
});

console.log("\n--- CATEGORY STORAGE REPORT ---");

categorySummary.forEach(summary => {
    console.log(
        `${summary.category}: ${summary.fileCount} files, ` +
        `${formatSize(summary.totalSize)}`
    );
});

console.log("\n--- DUPLICATE FILE REPORT ---");

if (duplicateFiles.length > 0) {
    duplicateFiles.forEach(file => {
        console.log(
            `${file.name} | Original location: ${file.folder}`
        );
    });
} else {
    console.log("No duplicate filenames found.");
}

console.log("\n--- LARGEST FILE ---");

if (largestFile) {
    console.log(`Name: ${largestFile.name}`);
    console.log(`Size: ${formatSize(largestFile.size)}`);
    console.log(`Original folder: ${largestFile.folder}`);
}

console.log("\n--- FILE TYPE CHECK ---");

console.log(
    `Contains JavaScript files: ${validFiles.some(
        file => getExtension(file.name) === "js"
    )}`
);

console.log(
    `All file records valid: ${files.every(isValidFile)}`
);

console.log("\n--- ORGANIZATION SUMMARY ---");

console.log(
    `Duplicate filenames detected: ${duplicateNames.size}`
);

console.log(
    `Files categorized as Other: ${
        (organizedFiles.get("Other") || []).length
    }`
);

console.log("Organization simulation completed successfully.");
console.log("No files were moved or modified.");
console.log("========================================");

/*

OUTPUT

========================================
         SMART FILE ORGANIZER
========================================
Total files scanned: 15
Valid files: 15
Invalid files: 0
Unique extensions: 13
Categories created: 9
Total storage: 36.14 MB

--- ORGANIZED FILES ---

Documents (4 files)
  - report.docx | 780 KB | From: Documents
  - resume.pdf | 450 KB | From: Downloads
  - resume.pdf | 450 KB | From: Desktop
  - notes.txt | 12 KB | From: Desktop

Images (3 files)
  - holiday.jpg | 2.34 MB | From: Pictures
  - profile.png | 1.17 MB | From: Desktop
  - logo.svg | 85 KB | From: Design

Code (2 files)
  - app.js | 45 KB | From: Coding
  - project.js | 32 KB | From: Coding

Spreadsheets (1 files)
  - budget.xlsx | 650 KB | From: Documents

Videos (1 files)
  - intro.mp4 | 14.65 MB | From: Downloads

Archives (1 files)
  - backup.zip | 8.01 MB | From: Downloads

Audio (1 files)
  - song.mp3 | 4.98 MB | From: Music

Presentations (1 files)
  - presentation.pptx | 2.25 MB | From: Documents

Other (1 files)
  - archive | 300 KB | From: Downloads

--- CATEGORY STORAGE REPORT ---
Videos: 1 files, 14.65 MB
Archives: 1 files, 8.01 MB
Audio: 1 files, 4.98 MB
Images: 3 files, 3.60 MB
Presentations: 1 files, 2.25 MB
Documents: 4 files, 1.65 MB
Spreadsheets: 1 files, 650 KB
Other: 1 files, 300 KB
Code: 2 files, 77 KB

--- DUPLICATE FILE REPORT ---
resume.pdf | Original location: Downloads
resume.pdf | Original location: Desktop

--- LARGEST FILE ---
Name: intro.mp4
Size: 14.65 MB
Original folder: Downloads

--- FILE TYPE CHECK ---
Contains JavaScript files: true
All file records valid: true

--- ORGANIZATION SUMMARY ---
Duplicate filenames detected: 1
Files categorized as Other: 1
Organization simulation completed successfully.
No files were moved or modified.
========================================

[Done] exited with code=0 in 0.27 seconds

*/