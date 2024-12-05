# TeLlevoApp

**TeLlevoApp** es una aplicación desarrollada con Ionic y Angular que facilita el transporte colaborativo entre estudiantes, permitiendo a los usuarios organizar y buscar viajes fácilmente.

---

## **Requisitos Previos**

Antes de instalar y ejecutar la aplicación, asegúrate de tener instalados los siguientes programas:

1. **Node.js** (versión recomendada: >= 16.0.0)
   - Descárgalo desde [Node.js Official Website](https://nodejs.org/).

2. **npm** (se instala junto con Node.js):
   - Verifica que está instalado ejecutando:
     ```bash
     npm -v
     ```

3. **Angular CLI** (versión: ^18.0.0):
   - Instálalo globalmente:
     ```bash
     npm install -g @angular/cli
     ```

4. **Ionic CLI** (versión: ^8.0.0):
   - Instálalo globalmente:
     ```bash
     npm install -g @ionic/cli
     ```

---

## **Descargar el Proyecto**

1. **Clona este repositorio en tu máquina local**:
   ```
   git clone https://github.com/usuario/TeLlevoApp.git
   cd TeLlevoApp
Instala las dependencias del proyecto:
```bash
npm install
```
Configuración de Claves y Variables de Entorno
La aplicación utiliza claves API para conectarse con servicios externos, como Google Maps y la API de Rick and Morty. Sigue estos pasos para configurar las claves:

Crea un archivo .env en la raíz del proyecto:

```
touch .env
```
Agrega las claves requeridas:

Abre el archivo .env y agrega tus claves:
env
```
GOOGLE_MAPS_API_KEY=tu-clave-de-google-maps
API_URL=https://rickandmortyapi.com/api/character
```
Asegúrate de proteger las claves sensibles:

Verifica que el archivo .env esté incluido en .gitignore para evitar que sea subido al repositorio:
```
.env
```
##**Ejecución de la Aplicación**
Ejecutar en el navegador:

Inicia el servidor de desarrollo con el siguiente comando:
```
ionic serve
```
Vista en el laboratorio de dispositivos:

Para ver cómo se comporta la aplicación en diferentes plataformas:
```
ionic serve --lab
```
---
Scripts Disponibles
El proyecto tiene los siguientes comandos disponibles en el archivo package.json:

npm start: Inicia el servidor de desarrollo.
npm run build: Genera los archivos para producción.
npm run test: Ejecuta las pruebas unitarias con Karma.
npm run lint: Analiza el código en busca de errores de estilo.
---

Dependencias Principales
Las principales tecnologías utilizadas en este proyecto son:

-Angular: Framework principal del proyecto.
-Ionic Framework: Herramientas para construir aplicaciones multiplataforma.
-Capacitor: Puente nativo para dispositivos móviles.
-RxJS: Manejo de programación reactiva.
---

Dependencias de Desarrollo

-Jasmine: Framework para pruebas unitarias.
-Karma: Herramienta para ejecutar pruebas.
-ESLint: Analizador de código para mantener un estilo consistente.
