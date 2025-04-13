require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Correct package

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in .env. Please ensure it's set correctly.");
    process.exit(1);
}

try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log("GoogleGenerativeAI initialized successfully!");

    async function runExample() {
      try {
        // --- *** TRY CHANGING THE MODEL NAME HERE *** ---
        // Option 1 (Most Likely): Use the versioned name
        // const modelName = "gemini-1.0-pro";

        // Option 2 (Newer Flash model - often free tier eligible):
        const modelName = "gemini-1.5-flash-latest";

        // Option 3 (Newer Pro model):
        // const modelName = "gemini-1.5-pro-latest";
        // --- *************************************** ---

        console.log(`\nAttempting to use model: ${modelName}`); // Log which model is being tried
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Write a short tagline for an AI assistant.";
        console.log("Sending prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Generated Text:", text);

      } catch(e) {
         console.error("\nError during model usage:", e); // Add newline for clarity
         // Log specific details if available
         if (e.status) {
             console.error(`HTTP Status: ${e.status} ${e.statusText || ''}`);
         }
         if (e.message) {
            console.error("Error Message:", e.message)
         }
         if (e.response && e.response.promptFeedback) {
            console.error("Prompt Feedback:", e.response.promptFeedback);
         }
         console.log("\nSuggestion: If this persists, verify the model name is available for your API key and region in Google AI Studio or documentation.");
      }
    }

    runExample();

} catch (error) {
    console.error("Error initializing GoogleGenerativeAI:", error);
    if (error.message) {
        console.error("Error message:", error.message);
    }
     if (error.stack) {
        console.error("Stack trace:\n", error.stack);
     }
    process.exit(1);
}