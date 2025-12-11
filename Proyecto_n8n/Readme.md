# 🛡️ Sistema de Clasificación de Leads Tolerante a Fallas (n8n + Docker)
### Proyecto de Automatización e Ingeniería de Software - Autocristales Gaitan

![Status](https://img.shields.io/badge/Status-Completed-green)
![Tech](https://img.shields.io/badge/Stack-n8n%20|%20Docker%20|%20JS-blue)

Daniel Gaitan Chavez
2025B
INCO


## 📋 Resumen Ejecutivo
Este proyecto implementa una arquitectura automatizada para la gestión de clientes potenciales (Leads). El sistema ingesta mensajes, procesa la intención del cliente y notifica al operador vía Telegram.

El enfoque principal del proyecto fue aplicar principios de **Computación Tolerante a Fallas**, diseñando un sistema que resiste la caída de servicios externos (APIs de IA) mediante mecanismos de simulación (Mocking) y degradación agraciada.

---

## 🎥 Demostración del Sistema

| Notificación en Tiempo Real (Móvil) | Ejecución del Flujo (Backend) |
| :---: | :---: |
| ![Demo Mobile](./evidencias/demo_mobile.gif) | ![Demo Workflow](./evidencias/demo_workflow.gif) |

---

## 🏗️ 1. Infraestructura y Despliegue (Docker)
Para garantizar la portabilidad y el aislamiento, el sistema se desplegó utilizando contenedores Docker. Se configuraron volúmenes persistentes para evitar pérdida de datos ante reinicios.

**Comando de instalación:**
![Docker Install](./evidencias/1_docker_install.png)

**Estado del Contenedor:**
> Servicio n8n operando en puerto 5678 con consumo de recursos estable.
![Docker Status](./evidencias/2_docker_status.png)

---

## 🧪 2. Ingesta de Datos
El flujo inicia con un **Webhook (POST)** que recibe datos estructurados desde herramientas de prueba (Postman) o formularios web.

**Trigger (Postman):**

![Postman](./evidencias/4_postman_trigger.png)

**Recepción Exitosa:**

![Webhook Payload](./evidencias/5_webhook_received.png)

---

## ⚠️ 3. El Desafío: Fallo en la API de Inteligencia Artificial
Siguiendo la rúbrica de *"Investigar, Experimentar y Fallar"*, se intentó integrar la API de **Google Gemini (1.5 Flash)** para realizar procesamiento de lenguaje natural (NLP).

A pesar de configurar correctamente las credenciales y headers:
![API Keys](./evidencias/6_google_keys.png)

**Se documentó un fallo crítico de disponibilidad (Error 404):**
La API rechazó las conexiones debido a inconsistencias en el versionado de los modelos, representando un punto único de fallo para el sistema.
![Error 404](./evidencias/7_error_api_404.png)
![Node Failure](./evidencias/8_node_failure.png)

---

## 🛡️ 4. Solución: Arquitectura Tolerante a Fallas
Para evitar que el negocio se detuviera por el fallo de la IA, se implementó un patrón de **Mocking & Fallback**.

**Estrategia:**
Se reemplazó la dependencia externa por un módulo lógico interno (JavaScript Node) que:
1.  **Simula** la estructura de respuesta de la IA.
2.  **Garantiza** la integridad de los datos (`intencion`, `auto`).
3.  **Permite** que el flujo continúe hacia la notificación.

**Arquitectura Resiliente Resultante:**
![Final Flow](./evidencias/9_resilient_flow.png)

---

## 🔬 5. Experimentación Extendida
Como parte de la investigación, se exploraron capacidades avanzadas de n8n, incluyendo la ejecución de comandos de sistema (`Execute Command`) para interactuar con el sistema de archivos local y generar logs en CSV.

**Flujo Extendido (Experimentación):**
![Experimentation](./evidencias/10_experimentation.png)

**Interacción con Sistema de Archivos:**
![Local Files](./evidencias/11_local_files.png)

---

## ✅ 6. Resultado Final
Gracias a la implementación de tolerancia a fallas, el sistema es capaz de entregar la alerta al operador humano sin interrupciones, independientemente del estado de la IA.

**Configuración del Bot:**
![Bot Setup](./evidencias/3_bot_creation.png)

**Notificación Exitosa en Producción:**
![Success](./evidencias/12_success_alert.png)

---

## 🧠 Análisis Teórico: Model Context Protocol (MCP)
*Requisito de Investigación*

La problemática de conexión experimentada (Errores 404/Headers) resalta la necesidad de estándares como **MCP**.

**¿Cómo MCP resolvería esto?**
En lugar de configurar manualmente peticiones HTTP frágiles, un servidor MCP expondría recursos estandarizados (ej: `inventario_cristales`). El LLM interactuaría con estos recursos mediante un protocolo seguro y universal, eliminando la complejidad de las integraciones API directas y reduciendo la superficie de error humano.

## 📑 Anexo: Reflexión Técnica y Respuestas a la Guía
A continuación, se da respuesta a las interrogantes planteadas en la asignación, basándonos en la experiencia de desarrollo de este proyecto.

### 1. Fundamentos de Automatización (n8n)

**¿Qué es n8n? ¿Cómo se compara con herramientas como Zapier o Make?**
n8n es una herramienta de automatización de flujos de trabajo basada en nodos. A diferencia de Zapier o Make (que son SaaS cerrados), n8n es "fair-code", lo que permite alojarlo en nuestros propios servidores (Self-hosted) usando Docker. Esto ofrece mayor privacidad de datos y elimina los límites estrictos de ejecuciones por costo que tienen las otras plataformas.

**¿Qué "disparador" (trigger) iniciará mi flujo?**
El flujo inicia con un nodo **Webhook**. Este escucha peticiones HTTP `POST` en una URL específica, actuando como la "puerta de entrada" para los datos que vienen desde el formulario web o Postman.

**¿Qué acciones deben suceder después?**
El flujo sigue una lógica lineal:
1.  **Recepción:** El Webhook acepta el JSON.
2.  **Procesamiento:** Se intenta analizar el texto (originalmente con IA, luego con Mock en JS).
3.  **Salida:** Se formatea el mensaje y se envía al Bot de Telegram.

**¿Cómo paso datos de un nodo a otro?**
En n8n, los datos fluyen en formato JSON. Cada nodo recibe la salida ("Output") del anterior como su entrada ("Input"). Utilizamos expresiones para referenciar datos específicos, por ejemplo: `{{ $json.body.mensaje }}`.

**¿Mi flujo funciona? ¿Qué pasa si falla un paso?**
El flujo es funcional. Sin embargo, descubrimos que las dependencias externas (APIs de IA) pueden fallar. Si un paso falla, el flujo se detiene y marca error. Para mitigar esto, implementamos lógica de respaldo (Fallback) en código, asegurando que el proceso sea **tolerante a fallas**.

---

### 2. Model Context Protocol (MCP) e Inteligencia Artificial

**¿Qué problema resuelve el Model Context Protocol? ¿Por qué es útil?**
El MCP resuelve la fragmentación en la conexión entre LLMs y datos. Actualmente, para conectar Gemini con n8n tuvimos que configurar manualmente Headers, URLs y Payloads (lo que causó errores 404). MCP estandariza esto, permitiendo una conexión universal y segura sin "reinventar la rueda" en cada integración.

**¿Cuál es la diferencia entre un "Cliente" y un "Servidor" MCP?**
* **Cliente MCP:** Es la interfaz donde vive el usuario o la IA (ej. Claude Desktop o el IDE). Es quien *pide* la información.
* **Servidor MCP:** Es el programa que tiene acceso a los datos (ej. nuestro sistema de Autocristales). Es quien *entrega* las herramientas o recursos al cliente.

**¿Cómo decide un LLM cuándo y qué herramienta MCP usar?**
El LLM analiza la descripción de las herramientas disponibles en el servidor. Si el prompt del usuario dice "Dame el precio del parabrisas", y el servidor expone una herramienta llamada `consultar_precio`, el LLM decide inteligentemente invocar esa función específica.

---

### 3. Integración y Lógica del Proyecto

**¿Qué parte de mi proceso se beneficia de la "inteligencia"?**
La clasificación de la intención (`intencion`) y la extracción de entidades (`marca`, `modelo`, `año`). Un sistema tradicional necesitaría muchos `if/else` complejos para entender "mi jetta se rompió" vs "cotiza un jetta". El LLM lo entiende nativamente.

**¿Qué datos necesita el LLM para hacer su trabajo? ¿Cómo se los proporciona N8N?**
El LLM necesita el mensaje crudo del cliente. n8n se lo proporciona inyectando la variable del Webhook dentro del cuerpo (Body) de la petición HTTP o dentro del script de simulación.

**¿Cómo estructuro el "prompt" que N8N enviará al LLM para obtener la respuesta deseada?**
Utilizamos un "System Prompt" que define el rol y el formato de salida estricto.
* *Ejemplo:* "Eres un experto en ventas. Analiza el mensaje y devuelve ÚNICAMENTE un JSON con esta estructura...".

**¿Qué hago con la respuesta del LLM? ¿Cómo la uso en el siguiente paso de mi automatización?**
La respuesta (un objeto JSON) se mapea a los campos del nodo de Telegram.
* El campo `auto.marca` del JSON se convierte en texto visible en la notificación: "🚗 Auto: Nissan".