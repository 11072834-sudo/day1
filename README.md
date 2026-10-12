# GymHelper Cloud Bot

**GymHelper Cloud Bot** — це простий хмарний сервіс для додатку трекінгу здоров'я. Він моніторить поточну погоду і автоматично надсилає користувачу в Telegram рекомендації щодо водного балансу у спекотні дні, а також нагадування про прийоми їжі.

## Архітектурна схема
gymhelper-cloud-bot/
├── .env.example       
├── .gitignore        
├── README.md          
└── diagram.png   

## Технологічний стек
* **Backend:** Node.js, Express.js
* **Інтегровані API:**
  1. Open-Meteo API https://open-meteo.com/ — для отримання поточної температури
  2. Telegram Bot API https://core.telegram.org/bots/api — для відправки повідомлень користувачу

