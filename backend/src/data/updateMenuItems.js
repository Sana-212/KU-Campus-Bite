require("dotenv").config();
const connectDB = require("../config/db.js");

const seededMenuData = require("./seededMenuData.js");
const MenuItem = require("../models/foodMenu.js");
const Canteen = require("../models/canteen.js");

async function updateMenuItems() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");

    let updatedCount = 0;

    // Loop through each menu item in your seeded data
    for (const item of seededMenuData) {
      // Find the correct Canteen ID using the Canteen name
      const canteen = await Canteen.findOne({ name: item.canteenName });

      if (canteen) {
        // Now use the found Canteen ID to update the menu item
        const result = await MenuItem.updateOne(
          { name: item.name, canteenId: canteen._id }, // Use Canteen ID for matching
          { $set: { image: item.image } }
        );

        // Check if any documents were actually modified
        if (result.modifiedCount > 0) {
          updatedCount++;
          console.log(
            `✅ SUCCESS: Updated item '${item.name}' with image: ${item.image}`
          );
        } else {
          console.log(
            `❌ FAILED: Could not update item '${item.name}'. Found ${result.matchedCount} matching documents but modified 0.`
          );
        }
      }
    }

    console.log(
      `Database updated with image paths. ${updatedCount} items were modified.`
    );
    process.exit(0);
  } catch (err) {
    console.error("Error updating documents:", err);
    process.exit(1);
  }
}

updateMenuItems();
