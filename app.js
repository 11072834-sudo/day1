require('dotenv').config();
const { Telegraf, Markup } = require('telegraf'); 
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const myChatId = process.env.TELEGRAM_CHAT_ID;

const bot = new Telegraf(token);

const LAT = 48.5132;
const LON = 32.2597;

bot.start((ctx) => {
    const welcomeText = "gymhelper_bot моніторить умови для тренувань та нагадує про харчування.";

    ctx.reply(welcomeText, Markup.keyboard([
        ['Погода зараз', 'Мій звіт'],
        ['Допомога']
    ]).resize());
});

bot.help((ctx) => {
    ctx.reply("Команди:\n/start - Головне меню\n/help - Допомога\n\nБот автоматично аналізує погоду і надсилає звіти кожні 5 хвилин.");
});

bot.hears('Погода зараз', (ctx) => {
    processAndNotify(ctx.chat.id);
});

bot.hears('Мій звіт', (ctx) => {
    ctx.reply("Ваша ціль: 2000 ккал. Залишилось: 500 ккал. Не забудьте внести дані в GymHelper!");
});

bot.hears('Допомога', (ctx) => {
    ctx.reply("Команди:\n/start - Головне меню\n/help - Допомога\n\nБот автоматично аналізує погоду і надсилає звіти кожні 5 хвилин.");
});

async function processAndNotify(chatId) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`;
        const response = await axios.get(url);
        
        const temp = response.data.current_weather.temperature;
        const weatherCode = response.data.current_weather.weathercode; 
        
        let message = `Температура у Кропивницькому: ${temp}°C.\n\n`;

        if (temp > 25) {
            message += `На вулиці спекотно, намагайтесь пити побільше водиці\n`;
        } else if (temp < 10) {
            message += `На вулиці прохолодно вдягніться тепліше \n`;
        } else {
            message += `Ідеальна температура для прогулянки \n`;
        }

        if (weatherCode >= 50) {
            message += `Очікуються опади`;
        } else {
            message += `Опадів не передбачається`;
        }

        bot.telegram.sendMessage(chatId, message);
        console.log(`Звіт надіслано, температура -> ${temp}°C, weatherCode -> ${weatherCode}`);
        
    } catch (error) {
        console.error("API error -> ", error.message);
    }
}

bot.launch();
console.log("gymhelper_bot успішно запущено");

setInterval(() => {
    console.log("Спрацював таймер автоматичної перевірки");
    if (myChatId) {
        processAndNotify(myChatId); 
    } else {
        console.log("chat ID не знайдено у файлі .env");
    }
}, 5 * 60 * 1000);


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));