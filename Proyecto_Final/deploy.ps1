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