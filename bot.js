const TelegramBot = require("node-telegram-bot-api");

const token = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Играть:", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "Играть",
          web_app: { url: "https://your-site.com" }
        }
      ]]
    }
  });
});