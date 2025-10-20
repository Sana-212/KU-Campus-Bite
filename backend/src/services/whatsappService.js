const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;
const TEMPLATE_CONTENT_SID = process.env.TWILIO_TEMPLATE_SID;
const CANTEEN_MANAGER_WHATSAPP = process.env.CANTEEN_MANAGER_WHATSAPP;
const CANTEEN_NAME = process.env.CANTEEN_NAME;

// Check if all necessary environment variables are set before initializing client
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TEMPLATE_CONTENT_SID || !CANTEEN_MANAGER_WHATSAPP || !CANTEEN_NAME) {
    console.error("CRITICAL: One or more Twilio environment variables are missing. WhatsApp notification will not work.");
    var client = null; // Set client to null if setup fails
} else {
    var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

/**
 * Sends a WhatsApp notification to the Canteen Manager about a new order.
 * @param {object} order - The saved Mongoose Order document.
 * @param {Array} items - The items array from the Cart.
 */
const sendOrderNotification = async (order, items) => {
    if (!client) {
        console.warn("WhatsApp client not initialized. Skipping order notification.");
        return;
    }

    try {
        // a. Prepare data for the limited template variables
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Variable 1: Canteen Name + Order Summary
        const var1_OrderSummary = `  [${CANTEEN_NAME}] New Order ( Items: ${totalItems} / ID: ${order._id.toString().slice(-4)})   `;

        // Variable 2: Detailed Items + Total Bill
        const foodDetailsString = items
            .map(item => `${item.name} x ${item.quantity}`)
            .join(', ');

        const var2_FullDetails = `${foodDetailsString}.    Total Bill: ${order.totalAmount} RS     `;

        // Create the contentVariables JSON string
        const contentVariables = JSON.stringify({
            "1": var1_OrderSummary,
            "2": var2_FullDetails
        });

        // b. Execute Twilio API call
        const message = await client.messages
            .create({
                from: TWILIO_WHATSAPP_FROM,
                contentSid: TEMPLATE_CONTENT_SID,
                contentVariables: contentVariables,
                to: CANTEEN_MANAGER_WHATSAPP
            });

        console.log(`WhatsApp notification sent for Order ID: ${order._id}. `);

    } catch (twilioError) {
        // Log the error. A failed notification does not mean the order failed.
        console.error('Twilio WhatsApp notification failed:', twilioError.message);
    }
};

module.exports = { sendOrderNotification };
