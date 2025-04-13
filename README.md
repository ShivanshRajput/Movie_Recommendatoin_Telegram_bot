# 🎭 Mood-Based Movie & Show Recommender Bot

A Telegram bot that suggests **movies and shows** based on your **mood and feelings**, using **AI-powered language models** like OpenAI's [ChatGPT](https://chatgpt.com/) or (optionally) [Google's Gemini](https://gemini.google.com).

---

## 🤖 Features

- Interactive **mood selector** with inline buttons 🎭  
- Accepts your short description or situation
- Chat-based movie/show suggestions tailored to your current emotion.
- Uses AI to suggest **3 personalized movies or shows**  
- Easily extendable to support **Google Gemini** or other free AI APIs  
- Fun, friendly, and simple UI on Telegram  
- Simple `.env` based configuration.
---

## 🚀 Demo

Check out the bot and get suggestions like:
- 💔 She Left Me → "Time for heartbreak anthems... 💔"
- 🤖 AI responds: "Here are 3 movies perfect for your current feels..."

---

## 📦 Tech Stack

- [**Node.js**](https://nodejs.org/en) + [**Telegraf**](https://www.npmjs.com/package/telegraf) (Telegram Bot Framework)  
- [**Axios**](https://www.npmjs.com/package/axios) (for making API requests)  
- [**dotenv**](https://www.npmjs.com/package/dotenv/v/16.5.0) (for managing environment variables)  
- [**OpenAI GPT (ChatGPT)**](https://chatgpt.com/) or plug in your own LLM like Gemini  

---

## 🚀 Getting Started - Setup Instuctions 

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/mood-recommender-bot.git](https://github.com/ShivanshRajput/Movie_Recommendatoin_Telegram_bot.git
cd Movie_Recommendatoin_Telegram_bot
```

### 2. Install Depenedencies


```bash
npm install
```

### 3. Set Environment Variables

Create a .env file in the root of the project with the following:
```ini
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_google_gemini_api_key
# or if using OpenAI instead
# OPENAI_API_KEY=your_openai_key
```

### 4. Run the Bot

```bash
node index.js
```


## 📦 Folder Structure 

```
📁 Movie_Recommendatoin_Telegram_bot
 ┣ 📄 .env
 ┣ 📄 index.js
 ┣ 📄 README.md
 ┗ 📄 package.json
```

## 💡 How It Works

- User selects a mood via inline buttons.
- Bot prompts the user to describe their feeling or situation.
- Bot sends the prompt to an AI (e.g. GPT-3.5-turbo or Gemini) to generate suggestions.
- User receives 3 tailored movie/show suggestions.


## 🧠 Mood Options Available

- 🌞 Warm Sunny Day

- 🌌 Scary Night

- 💔 She Left Me

- 🔥 I’ma Change Now

- 🧟‍♂️ Zombie Rule the World

- 🧘 Let’s Meditate

- 🏛 Power and Politics

- 💕 Lovey Dovey


## 🛡 License

This project is licensed under the [MIT License]().

## ✨ Acknowledgements

- [Telegraf](https://www.npmjs.com/package/telegraf)

- [OpenAI API](https://platform.openai.com/api-keys)

- [Google Gemini](https://gemini.google.com) (coming soon)

- Your creative mood 🌈

## 👤 Author

[Shivansh Rajput](https://github.com/ShivanshRajput)

## 🌟 Show Your Support

If you like this project, give it a ⭐️ on GitHub!





