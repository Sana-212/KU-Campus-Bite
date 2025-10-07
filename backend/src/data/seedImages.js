const fs = require('fs');
const path = require('path');
const menuItems = require('./menuData'); // Your menu data
const menuImagesDir = 'D:/ku-campus-bite/KU-Frontend/images/menu_items';

// --- Helper Functions ---
function normalizeName(name) {
    let normalized = name.toLowerCase();
    normalized = normalized.replace(/\./g, '');
    normalized = normalized.replace(/-/g, '');
    normalized = normalized.replace(/\s+/g, '_').trim();
    return normalized;
}

function imageExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (e) {
        return false;
    }
}

// --- Image Seeding Logic ---
const seededMenuItems = menuItems.map(item => {
    let normalizedName = normalizeName(item.name);
    let imageFound = false;
    let imagePath = '';
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];

    // 1. First, try to find an exact match for the item's normalized name
    for (const ext of extensions) {
        const potentialImagePath = path.join(menuImagesDir, `${normalizedName}${ext}`);
        if (imageExists(potentialImagePath)) {
            imagePath = `/images/menu_items/${normalizedName}${ext}`;
            imageFound = true;
            break;
        }
    }

    // 2. If no exact match is found, try to find a relevant image using keywords
    if (!imageFound) {
        // Define common keywords and their corresponding generic image names
        const keywordMappings = {
            'burger': 'chicken_burger',
            'pizza': 'pizza',
            'sandwich': 'sandwich',
            'shawarma': 'shawarma',
            'roll': 'roll',
            'mojito': 'mojito',
            'chicken': 'chicken',
            'bbq': 'bbq',
            'soup': 'soup',
            'pasta': 'pasta',
            'platter': 'platter',
            'fries': 'fries',
            'nuggets': 'nuggets',
            'wings': 'wings',
            'ice_cream': 'ice_cream',
            'cold_coffee': 'cold_coffee'
        };

        const itemWords = normalizedName.split('_');

        for (const word of itemWords) {
            if (keywordMappings[word]) {
                const genericImageName = keywordMappings[word];
                for (const ext of extensions) {
                    const potentialImagePath = path.join(menuImagesDir, `${genericImageName}${ext}`);
                    if (imageExists(potentialImagePath)) {
                        imagePath = `/images/menu_items/${genericImageName}${ext}`;
                        imageFound = true;
                        break;
                    }
                }
            }
            if (imageFound) break;
        }
    }

    // 3. If no specific image (exact or keyword-based) is found, use the fallback image.
    if (!imageFound) {
        imagePath = '/images/menu_items/default_food.jfif';
    }

    // Add the image path to the menu item object
    return { ...item, image: imagePath };
});

// Save the updated data as a JS file
const output = `module.exports = ${JSON.stringify(seededMenuItems, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'seededMenuData.js'), output, 'utf8');

console.log('Seeding complete. Updated data saved to seededMenuData.js');