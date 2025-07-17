const axios = require('axios');

const TOKEN = '7627992431:AAHbLgpWqlf9j48IjoS_a6ddYTqqdi4i-DA';
const CHAT_ID = '7182828115';

// 👉 POST /notificaciones/whatsapp
exports.enviarNotificacionTelegram = async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  try {
    const respuesta = await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: 'Markdown' // opcional
    });

    res.json({
      ok: true,
      mensaje: 'Mensaje enviado correctamente por Telegram.',
      telegram_response: respuesta.data
    });
  } catch (error) {
    console.error('❌ Error al enviar mensaje por Telegram:', error.message);
    res.status(500).json({
      error: 'No se pudo enviar el mensaje a Telegram.',
      detalle: error.response?.data || error.message
    });
  }
};
