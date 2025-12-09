const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// URL del servicio de lógica. 
// En Kubernetes usaremos el nombre del servicio DNS. Localmente busca la variable o usa localhost.
const LOGIC_SERVICE_URL = process.env.LOGIC_URL || 'http://localhost:5000';

app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>🔥 FlameTickets 🎸</h1>
            <p>Sistema de Microservicios Resiliente (Node.js + Python)</p>
            <hr>
            <h3>Concierto: Katia & Flame - Acoustic Tour 2025</h3>
            <p>Estado del sistema: <span style="color:green;">ONLINE</span></p>
            <br>
            <a href="/comprar">
                <button style="padding: 15px 30px; font-size: 18px; cursor: pointer; background-color: #ff5722; color: white; border: none; border-radius: 5px;">
                    COMPRAR BOLETO VIP 🎫
                </button>
            </a>
        </div>
    `);
});

app.get('/comprar', async (req, res) => {
    try {
        console.log(`[Frontend] Enviando petición a: ${LOGIC_SERVICE_URL}/process-order`);
        
        // Comunicación entre microservicios
        const response = await axios.post(`${LOGIC_SERVICE_URL}/process-order`, {
            user: 'Usuario_Invitado',
            ticketType: 'VIP_ACCESS'
        });

        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">¡Compra Exitosa! ✅</h1>
                <div style="border: 1px solid #ccc; padding: 20px; display: inline-block; text-align: left; background: #f9f9f9;">
                    <p><strong>ID Ticket:</strong> ${response.data.ticket_id}</p>
                    <p><strong>Mensaje:</strong> ${response.data.message}</p>
                    <p><strong>Procesado por:</strong> ${response.data.service_origin}</p>
                </div>
                <br><br>
                <a href="/">Volver al inicio</a>
            </div>
        `);
    } catch (error) {
        console.error("[Frontend] Error:", error.message);
        res.status(500).send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: red;">¡Error de Servicio! ❌</h1>
                <p>El microservicio de lógica no responde.</p>
                <p><i>(Esto demuestra que el frontend sobrevive aunque el backend falle)</i></p>
                <code style="background: #eee; padding: 5px;">${error.message}</code>
                <br><br>
                <a href="/">Intentar de nuevo</a>
            </div>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Frontend escuchando en puerto ${PORT}`);
});