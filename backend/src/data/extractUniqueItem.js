const fs = require('fs');
const menuItems = require('./menuData.js');

function normalizeName(name) {
    let normalized = name.toLowerCase();
    normalized = normalized.replace(/\./g, '');
    normalized = normalized.replace(/-/g, '');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}

const normalizedNames = menuItems.map(item => normalizeName(item.name));
const uniqueNamesSet = new Set(normalizedNames);
const uniqueFoodItems = Array.from(uniqueNamesSet).sort();

// Convert the array to a single string with each item on a new line
const outputString = uniqueFoodItems.join('\n');

// Write the output to a new file in the same directory
fs.writeFileSync('unique_food_items.txt', outputString, 'utf8');

// Log a success message to the terminal so you know it worked
console.log("Successfully extracted unique food items and saved to unique_food_items.txt");