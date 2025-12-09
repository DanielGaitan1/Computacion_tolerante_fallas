from flask import Flask, jsonify, request
import os
import random
import socket

app = Flask(__name__)

# Simulamos base de datos en memoria
contador_tickets = 1000

@app.route('/process-order', methods=['POST'])
def process_order():
    global contador_tickets
    
    # SIMULACIÓN DE CAOS: 20% de probabilidad de fallo aleatorio
    # Esto servirá para demostrar "Fault Tolerance" en vivo si te preguntan.
    if random.random() < 0.2:
        return jsonify({"error": "Error interno simulado (Chaos Engineering)"}), 500

    contador_tickets += 1
    data = request.json
    usuario = data.get('user', 'Anonimo')
    
    # Obtenemos el ID del contenedor para demostrar balanceo de carga
    hostname = socket.gethostname()

    print(f"[Logic] Procesando orden #{contador_tickets} para {usuario}")

    return jsonify({
        "status": "confirmed",
        "ticket_id": f"TKT-{contador_tickets}",
        "message": "¡Tu lugar para Katia & Flame está reservado!",
        "service_origin": f"Procesado en contenedor Python: {hostname}"
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)