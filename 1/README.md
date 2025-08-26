# Manejo de Errores en Programación
**Materia:** Computación Tolerante a Fallas  
**Alumno:** Daniel Gaitán  

## Introducción
En la programación es común que ocurran errores durante el desarrollo o la ejecución de un programa. Estos errores pueden ser de **sintaxis, semántica o ejecución**. Para hacer a los sistemas más tolerantes a fallas, existen herramientas que permiten **detectar, manejar y prevenir errores**, evitando que el programa se detenga de manera inesperada.

## Herramientas de Manejo de Errores

### 1) Manejo de excepciones (`try/except`)  
Permite capturar errores en tiempo de ejecución y responder de forma controlada.
```python
try:
    x = int(input("Ingresa un número: "))
    y = int(input("Ingresa otro número: "))
    print("Resultado:", x / y)
except ValueError:
    print("Error: Debes ingresar números válidos.")
except ZeroDivisionError:
    print("Error: No se puede dividir entre 0.")
2) Validación de entradas
Antes de procesar datos, se comprueba que cumplan con el formato correcto.

python
Copiar
Editar
entrada = input("Escribe un número: ")
if entrada.isdigit():
    print("Número válido:", int(entrada))
else:
    print("Error: No ingresaste un número.")
3) Registros de errores (logging)
Guardan información de errores en un archivo para su análisis posterior.

python
Copiar
Editar
import logging

logging.basicConfig(filename="errores.log", level=logging.ERROR)

try:
    resultado = 10 / 0
except Exception as e:
    logging.error("Ocurrió un error: %s", e)
4) Pruebas (testing) con aserciones
Aseguran que las funciones trabajen correctamente.

python
Copiar
Editar
def suma(a, b):
    return a + b

# Prueba simple
assert suma(2, 3) == 5
Conclusión
El manejo de errores es fundamental para crear aplicaciones más estables y tolerantes a fallas. Usar try/except, validar entradas, registrar errores y añadir pruebas reduce fallos y evita interrupciones inesperadas.