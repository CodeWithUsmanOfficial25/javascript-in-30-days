
/*
Day 17: Weather Data Analyzer
Concepts: map(), filter(), reduce(), some(), every(), sort()
*/

// Store daily weather records for analysis.
const weatherRecords = [
    { city: "Lahore", temperature: 38, humidity: 65, condition: "Sunny" },
    { city: "Islamabad", temperature: 29, humidity: 55, condition: "Cloudy" },
    { city: "Karachi", temperature: 34, humidity: 78, condition: "Humid" },
    { city: "Murree", temperature: 22, humidity: 70, condition: "Rainy" },
    { city: "Multan", temperature: 41, humidity: 40, condition: "Sunny" },
    { city: "Peshawar", temperature: 36, humidity: 50, condition: "Sunny" }
];

// Convert temperatures from Celsius to Fahrenheit.
function convertTemperatures(records) {
    return records.map((record) => ({
        ...record,
        fahrenheit: Number(
            ((record.temperature * 9) / 5 + 32).toFixed(1)
        )
    }));
}

// Find cities where temperature is above the given limit.
function findHotCities(records, limit) {
    return records.filter((record) => record.temperature > limit);
}

// Calculate the average temperature of all cities.
function calculateAverageTemperature(records) {
    if (records.length === 0) {
        return 0;
    }

    const total = records.reduce(
        (sum, record) => sum + record.temperature,
        0
    );

    return Number((total / records.length).toFixed(2));
}

// Sort cities from highest to lowest temperature.
function sortByTemperature(records) {
    // Original array ko change hone se bachane ke liye copy sort karo.
    return [...records].sort(
        (a, b) => b.temperature - a.temperature
    );
}

// Check whether any city has very high humidity.
function hasHighHumidity(records, limit) {
    return records.some((record) => record.humidity > limit);
}

// Check whether all records contain valid temperature values.
function hasValidTemperatures(records) {
    return records.every(
        (record) =>
            Number.isFinite(record.temperature) &&
            record.temperature >= -100 &&
            record.temperature <= 70
    );
}

// Display the analysis in a readable format.
function displayWeatherReport(records) {
    console.log("===== WEATHER DATA ANALYZER =====\n");

    console.log("All Cities:");
    records.forEach((record) => {
        console.log(
            `${record.city}: ${record.temperature}°C, ` +
            `${record.humidity}% humidity, ${record.condition}`
        );
    });

    console.log("\nTemperature Conversion (Celsius to Fahrenheit):");
    const convertedRecords = convertTemperatures(records);

    convertedRecords.forEach((record) => {
        console.log(
            `${record.city}: ${record.temperature}°C = ${record.fahrenheit}°F`
        );
    });

    console.log("\nHot Cities (Above 35°C):");
    const hotCities = findHotCities(records, 35);

    hotCities.forEach((record) => {
        console.log(`${record.city}: ${record.temperature}°C`);
    });

    console.log(
        `\nAverage Temperature: ${calculateAverageTemperature(records)}°C`
    );

    console.log("\nCities Sorted by Temperature (Highest First):");
    sortByTemperature(records).forEach((record) => {
        console.log(`${record.city}: ${record.temperature}°C`);
    });

    console.log(
        "\nAny city with humidity above 75%?",
        hasHighHumidity(records, 75)
    );

    console.log(
        "Are all temperature values valid?",
        hasValidTemperatures(records)
    );
}

displayWeatherReport(weatherRecords);

/*
Output:

===== WEATHER DATA ANALYZER =====

All Cities:
Lahore: 38°C, 65% humidity, Sunny
Islamabad: 29°C, 55% humidity, Cloudy
Karachi: 34°C, 78% humidity, Humid
Murree: 22°C, 70% humidity, Rainy
Multan: 41°C, 40% humidity, Sunny
Peshawar: 36°C, 50% humidity, Sunny

Temperature Conversion (Celsius to Fahrenheit):
Lahore: 38°C = 100.4°F
Islamabad: 29°C = 84.2°F
Karachi: 34°C = 93.2°F
Murree: 22°C = 71.6°F
Multan: 41°C = 105.8°F
Peshawar: 36°C = 96.8°F

Hot Cities (Above 35°C):
Lahore: 38°C
Multan: 41°C
Peshawar: 36°C

Average Temperature: 33.33°C

Cities Sorted by Temperature (Highest First):
Multan: 41°C
Lahore: 38°C
Peshawar: 36°C
Karachi: 34°C
Islamabad: 29°C
Murree: 22°C

Any city with humidity above 75%? true
Are all temperature values valid? true

[Done] exited with code=0 in 0.346 seconds
*/
