// public/utils/enviarTelegram.js
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function enviarMensajeTelegram(texto) {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: texto,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('❌ Error al enviar mensaje Telegram:', error.message);
  }
}

module.exports = enviarMensajeTelegram;