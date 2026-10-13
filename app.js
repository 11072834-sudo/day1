require('dotenv').config(); 
const express = require('express');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const LAT = 48.5132;
const LON = 32.2597;

app.get('/send-report', async (req, res) => {
    try {
        console.log("збір даних...");

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`;
        const weatherResponse = await axios.get(weatherUrl);

        if (weatherResponse.status !== 200) {
            throw new Error(`Помилка API погоди: статус ${weatherResponse.status}`);
        }

        const temperature = weatherResponse.data.current_weather.temperature;
        
        let message = `Звіт по погоді від GymHelper.\n`;
        message += `Поточна температура у Кропивницькому: ${temperature}°C.\n`;
        
        if (temperature > 25) {
            message += `На вулиці спекотно, не забудь випити більше води під час тренування`;
        }

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramResponse = await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });

        if (telegramResponse.status !== 200) {
            throw new Error(`Помилка Telegram API: статус ${telegramResponse.status}`);
        }

        console.log("Успіх, повідомлення відправлено в Telegram!");
        res.status(200).json({ 
            success: true, 
            message: "Звіт успішно відправлено", 
            weather: `${temperature}°C` 
        });

    } catch (error) {
        console.error("Сталася помилка під час виконання: ", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Не вдалося виконати інтеграцію. Деталі в консолі сервера" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`GymHelper запущено на порту ${PORT}`);
    console.log(`Перейдіть за посиланням http://localhost:${PORT}/send-report щоб протестувати.`);
});