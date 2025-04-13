require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
// *** 1. Use the CORRECT package and import style ***
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Basic Checks ---
if (!BOT_TOKEN) {
    console.error("BOT_TOKEN not found in .env file!");
    process.exit(1);
}
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in .env file!");
    process.exit(1);
}
// --- End Checks ---


// Initialize Telegraf bot
const bot = new Telegraf(BOT_TOKEN);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// *** 2. Use the CORRECT model name that worked ***
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Store user mood temporarily (lost on restart)
const userMood = {};

// Helper function to handle mood response and prompt for input
const handleMoodSelection = (ctx, mood, message) => {
    // Answer the callback query to remove the "loading" state on the button
    ctx.answerCbQuery();
    ctx.reply(message); // Send the one-liner response
    userMood[ctx.from.id] = mood; // Store the user's mood
    ctx.reply('Now, tell me, what happened? Briefly describe your situation or what you’re feeling.');
};

bot.start((ctx) => {
    ctx.reply(
        'Welcome!! Let’s see what mood you got in here 🎭\nChoose what fits your vibes... ;-)',
        Markup.inlineKeyboard([
            [Markup.button.callback('🌞 Warm Sunny Day', 'warm_sunny_day')],
            [Markup.button.callback('🌌 Scary Night', 'scary_night')],
            [Markup.button.callback('💔 She Left Me', 'she_left_me')],
            [Markup.button.callback('🔥 I’ma Change Now', 'ima_change_now')],
            [Markup.button.callback('🧟‍♂️ Zombie Rule the World', 'zombie_rule_the_world')],
            [Markup.button.callback('🧘 Let’s Meditate', 'lets_meditate')],
            [Markup.button.callback('🏛 Power and Politics', 'power_and_politics')],
            [Markup.button.callback('💕 Lovey Dovey', 'lovey_dovey')],
        ])
    );
});

// Mood selection handlers
bot.action('warm_sunny_day', (ctx) => handleMoodSelection(ctx, 'warm_sunny_day', 'Here’s something bright and chill for your sunny vibe! ☀️'));
bot.action('scary_night', (ctx) => handleMoodSelection(ctx, 'scary_night', 'Let’s get spooky! 👻'));
bot.action('she_left_me', (ctx) => handleMoodSelection(ctx, 'she_left_me', 'Time for heartbreak anthems... 💔'));
bot.action('ima_change_now', (ctx) => handleMoodSelection(ctx, 'ima_change_now', 'Let’s turn the page 🔥'));
bot.action('zombie_rule_the_world', (ctx) => handleMoodSelection(ctx, 'zombie_rule_the_world', 'Grab your bat, it’s apocalypse time 🧟‍♂️'));
bot.action('lets_meditate', (ctx) => handleMoodSelection(ctx, 'lets_meditate', 'Here’s something calm and mindful 🧘‍♀️'));
bot.action('power_and_politics', (ctx) => handleMoodSelection(ctx, 'power_and_politics', 'Get ready for drama and power moves 💼'));
bot.action('lovey_dovey', (ctx) => handleMoodSelection(ctx, 'lovey_dovey', 'Cuddly stuff incoming 💞'));

// Handle user text input for mood description
bot.on('text', async (ctx) => {
    // Ignore commands like /start
    if (ctx.message.text.startsWith('/')) {
        return;
    }

    const userId = ctx.from.id;
    const mood = userMood[userId];

    // Check if mood was set for this user
    if (!mood) {
        // Optional: Remind user to select a mood first if they type text without context
        // ctx.reply('Please select a mood first using the /start command.');
        return;
    }

    const userInput = ctx.message.text; // Get the user's description

    // Acknowledge receipt and indicate processing
    await ctx.reply('Got it! Thinking of some suggestions based on your vibe... 🤔');

    try {
        // Construct the prompt for Gemini
        const prompt = `Suggest exactly 3 movies or TV shows (with brief reasons why) for someone whose chosen mood is "${mood}" and feels like this: "${userInput}". Format the response clearly, perhaps as a numbered list.`;

        console.log(`[User ${userId}] Prompt: ${prompt}`); // Log the prompt

        // Generate content using the specified model
        const result = await model.generateContent(prompt);
        const response = result.response; // Access the response object directly

        // --- Enhanced Response Handling ---
        let replyText = '';
        if (response && response.candidates && response.candidates.length > 0) {
            // Check for safety ratings (optional but good practice)
            const safetyRatings = response.candidates[0].safetyRatings;
            const isBlocked = safetyRatings && safetyRatings.some(rating => rating.probability !== 'NEGLIGIBLE' && rating.probability !== 'LOW'); // Adjust blocking criteria as needed

            if (isBlocked) {
                console.warn(`[User ${userId}] Gemini response potentially blocked due to safety ratings:`, safetyRatings);
                replyText = "I couldn't generate suggestions because the topic might be sensitive. Try describing your feelings differently.";
            } else {
                 // Use response.text() as a shortcut to get the text content
                replyText = response.text();
                console.log(`[User ${userId}] Gemini Raw Text Response: ${replyText}`);
            }
        }

        if (replyText) {
            await ctx.reply(replyText);
        } else {
            // Handle cases where Gemini might return an empty response or format is unexpected
            console.warn(`[User ${userId}] Gemini returned no usable text content. Full response:`, JSON.stringify(response, null, 2));
            await ctx.reply("Sorry, I couldn't quite generate suggestions based on that. Maybe try phrasing it differently?");
        }
        // --- End Enhanced Response Handling ---


    } catch (err) {
        console.error(`[User ${userId}] Error during Gemini request:`, err);
        // Provide more specific error feedback if possible
        let errorMessage = 'Oops! Something went wrong while generating suggestions.';
        if (err.message && err.message.includes('429')) { // Check for rate limiting
             errorMessage = 'I seem to be quite popular right now! Please try again in a moment.';
        } else if (err.message && err.message.includes('400')) { // Bad request (often API key)
            errorMessage = 'There might be an issue with my connection. Please try again later.';
        }
        await ctx.reply(errorMessage);
    } finally {
         // Reset user mood after processing, regardless of success or failure
        delete userMood[userId];
        console.log(`[User ${userId}] Mood state cleared.`);
    }
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot is starting...');
bot.launch().then(() => {
    console.log('Bot launched successfully!');
}).catch(err => {
    console.error('Error launching bot:', err);
});