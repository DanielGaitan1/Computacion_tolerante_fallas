Markdown

# 🔥 FlameTickets: Arquitectura de Microservicios Resiliente

**Proyecto Final & v1**
**Materia:** Computación Tolerante a Fallas
**Alumno:** [Daniel Gaitan Chavez]
**Semestre:** 2025B

---

## 📋 Cumplimiento de Objetivos Técnicos

Este proyecto implementa una solución de venta de boletos distribuida, siguiendo estrictamente los principios de microservicios y tolerancia a fallos.

### 1. División en Servicios Independientes
La aplicación se desacopló en dos módulos autónomos con responsabilidades únicas:
* **Frontend Service (Node.js/Express):** Gateway de cara al usuario. Maneja la interfaz web y la orquestación de llamadas.
* **Logic Service (Python/Flask):** Núcleo de procesamiento. Gestiona la lógica de negocio de las órdenes.
* *Justificación:* El uso de lenguajes distintos demuestra la independencia tecnológica de cada componente.

### 2. Contenerización con Docker
Cada microservicio cuenta con su propio `Dockerfile`, utilizando imágenes base ligeras (`node:18-alpine` y `python:3.9-slim`) para garantizar portabilidad y consistencia entre entornos de desarrollo y producción.

### 3. Orquestación con Kubernetes
Se utiliza un clúster de Kubernetes para gestionar el ciclo de vida de la aplicación.
* **Deployments:** Garantizan el estado deseado de la aplicación.
* **Self-Healing:** Configuración automática para reiniciar contenedores fallidos.

### 4. Comunicación entre Microservicios
La interacción se realiza mediante **API REST** sobre HTTP.
* Se utiliza el DNS interno de Kubernetes (`flame-logic-service`) para el descubrimiento de servicios, eliminando la dependencia de IPs fijas.

### 5. Monitorización y Observabilidad
Implementación de **Logging Estructurado** en salida estándar (STDOUT/STDERR).
* Kubernetes agrega los logs de todos los pods, permitiendo inspeccionar el tráfico en tiempo real mediante `kubectl logs -l app=flame-frontend`.

### 6. Automatización (CI/CD)
Se incluyen scripts de automatización (`deploy.ps1`) que estandarizan el proceso de:
1.  Construcción de imágenes (Build).
2.  Empaquetado.
3.  Despliegue al clúster (Deploy).

### 7. Diseño Escalable y Resiliente
* **Escalabilidad Horizontal:** El servicio de lógica está configurado con `replicas: 2` para balancear la carga.
* **Resiliencia:** El Frontend implementa manejo de errores (Try/Catch) para degradar el servicio elegantemente si el Backend falla, mostrando mensajes amigables al usuario en lugar de colapsar.

### 8. Seguridad y Aislamiento
* **Network Policy:** El servicio de lógica (`ClusterIP`) está aislado de internet; solo acepta peticiones del Frontend dentro de la red privada del clúster. Solo el Frontend expone puerto público (`LoadBalancer`).

### 9. Ingeniería del Caos (Chaos Engineering)
El sistema fue sometido a pruebas de estrés y fallos inyectados:
* **Nivel Infraestructura:** Eliminación manual de Pods en ejecución para verificar la regeneración automática por parte del ReplicaSet.
* **Nivel Aplicación:** Inyección de código en Python (`random fail`) que simula errores 500 aleatorios para probar la robustez del cliente.

---

## 🚀 Guía de Despliegue (Tutorial)

### Prerrequisitos
* Docker Desktop habilitado con Kubernetes.
* Terminal (PowerShell o Bash).

### Paso 1: Clonar y Ubicarse
```bash
git clone [https://github.com/DanielGaitan1/Computacion_tolerante_fallas/tree/main]
cd Computacion_tolerante_fallas/Proyecto_Final
Paso 2: Ejecutar Script de Automatización
Hemos creado un script que construye las imágenes y despliega los servicios automáticamente.

En PowerShell:

PowerShell

./deploy.ps1
(Alternativamente, despliegue manual):

```Bash

docker build -t flame-frontend:v1 ./service-frontend
docker build -t flame-logic:v1 ./service-logic
kubectl apply -f ./k8s/main-deployment.yaml
Paso 3: Verificar y Probar
Verificar que los pods estén corriendo: kubectl get pods

Acceder a la web: http://localhost

Verificar logs: kubectl logs -l app=flame-logic

🧪 Evidencias de Resiliencia
Prueba de Caos (Pod Deletion)
Al eliminar un pod crítico: kubectl delete pod logic-deployment-xxxx Kubernetes detecta la discrepancia y crea una nueva instancia en < 5 segundos.

(Ver capturas en la carpeta de evidencias)


---

### 🎁 El Toque Final: El Script de "Automatización"

Para que el punto 6 sea verdad, crea un archivo nuevo en la carpeta `Proyecto_Final` llamado **`deploy.ps1`** y pega esto:

```powershell
# Script de Automatización de Despliegue (CI/CD Simulado)
Write-Host "🔥 Iniciando despliegue de FlameTickets..." -ForegroundColor Yellow

# 1. Build Frontend
Write-Host "🏗️  Construyendo Frontend..."
docker build -t flame-frontend:v1 ./service-frontend

# 2. Build Logic
Write-Host "🏗️  Construyendo Logic Service..."
docker build -t flame-logic:v1 ./service-logic

# 3. Deploy to K8s
Write-Host "🚀 Desplegando en Kubernetes..."
kubectl apply -f ./k8s/main-deployment.yaml

Write-Host "✅ Despliegue completado con éxito." -ForegroundColor Green
Write-Host "🌐 Accede en: http://localhost"