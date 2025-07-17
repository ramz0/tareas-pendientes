const Tarea = require('../models/Tarea');
const axios = require('axios');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function esMismaFecha(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function esManiana(fecha) {
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  return esMismaFecha(fecha, manana);
}

function esHoy(fecha) {
  const hoy = new Date();
  return esMismaFecha(fecha, hoy);
}

function estaVencida(fecha) {
  const ahora = new Date();
  return fecha < ahora && !esHoy(fecha);
}

async function verificarTareasPorVencer() {
  const ahora = new Date();
  try {
    const tareas = await Tarea.find({ completada: false });

    if (tareas.length === 0) {
      console.log('✅ No hay tareas pendientes.');
      return;
    }

    for (const tarea of tareas) {
      const vencimiento = new Date(tarea.fechaVencimiento);
      let tipo = null;

      if (esHoy(vencimiento)) tipo = '🔵👀 *Tarea que vence HOY* 👀🔵';
      else if (esManiana(vencimiento)) tipo = '🟣👀 *Tarea que vence MAÑANA* 👀🟣';
      else if (estaVencida(vencimiento)) tipo = '🔴😶 *Tarea VENCIDA* 😶🔴';

      if (tipo) {
        const fechaFormateada = vencimiento.toLocaleString('es-MX', {
          timeZone: 'America/Mexico_City',
          dateStyle: 'full',
          timeStyle: 'short'
        });

        const mensaje = `${tipo}\n\n*${tarea.titulo}*\n\n📝 ${tarea.descripcion || 'Sin descripción'}\n\n⏱️ Prioridad: *${tarea.prioridad}*\n🗓️ Fecha límite: *${fechaFormateada}*`;

        try {
          await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
          });
          console.log(`🔔 Notificación enviada: ${tarea.titulo}`);
        } catch (error) {
          console.error('❌ Error al enviar mensaje Telegram:', error.response?.data || error.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error al verificar tareas por vencer:', error.message);
  }
}

module.exports = verificarTareasPorVencer;
