# **TeLlevoApp**

**TeLlevoApp** es una aplicación desarrollada con **Ionic** y **Angular** que facilita el transporte colaborativo entre estudiantes, permitiendo a los usuarios organizar y buscar viajes fácilmente.

---

## **Requisitos Previos**
Antes de instalar y ejecutar la aplicación, asegúrate de tener instalados los siguientes programas:

### **1. Node.js**
- **Versión recomendada:** >= 16.0.0
- Descárgalo desde [Node.js Official Website](https://nodejs.org).

### **2. npm**
- Se instala junto con Node.js.
- Verifica que está instalado ejecutando:
  ```bash
  npm -v
### **3. Angular CLI**
Versión recomendada: ^18.0.0
Instálalo globalmente ejecutando:

npm install -g @angular/cli
### **4. Ionic CLI**
Versión recomendada: ^8.0.0
Instálalo globalmente ejecutando:
npm install -g @ionic/cli
**Descargar el Proyecto**
Clona este repositorio en tu máquina local:

git clone https://github.com/usuario/TeLlevoApp.git
cd TeLlevoApp
**Instala las dependencias del proyecto:**

npm install
**Configuración de Claves y Variables de Entorno**
La aplicación utiliza claves API para conectarse con servicios externos, como Google Maps. Sigue estos pasos para configurar las claves:

**Crea un archivo .env en la raíz del proyecto:**

touch .env


**Agrega las claves requeridas: Abre el archivo .env y agrega las claves:**

GOOGLE_MAPS_API_KEY=tu-clave-de-google-maps
API_URL=https://rickandmortyapi.com/api/character
Protege las claves sensibles: Asegúrate de que el archivo .env esté incluido en .gitignore para evitar que sea subido al repositorio:
.env


**Ejecución de la Aplicación**
1. Ejecutar en el navegador:
Inicia el servidor de desarrollo con el siguiente comando:

ionic serve
2. Vista en el laboratorio de dispositivos:
Para ver cómo se comporta la aplicación en diferentes plataformas, ejecuta:

ionic serve --lab
Generación de la APK
Construye el proyecto para Android:

ionic build
npx cap add android
npx cap sync android
Abre el proyecto en Android Studio:

npx cap open android
Desde Android Studio, compila la aplicación y genera el archivo APK.

**Scripts Disponibles**
El proyecto tiene los siguientes comandos disponibles en el archivo package.json:

npm start: Inicia el servidor de desarrollo.
npm run build: Genera los archivos para producción.
npm run test: Ejecuta las pruebas unitarias con Karma.
npm run lint: Analiza el código en busca de errores de estilo.

**Dependencias Principales**
1. Frameworks:
Angular: Framework principal del proyecto.
Ionic Framework: Herramientas para construir aplicaciones multiplataforma.
Capacitor: Puente nativo para dispositivos móviles.
RxJS: Manejo de programación reactiva.
2. APIs:
Google Maps API: Para mostrar rutas y localizaciones.
Rick and Morty API: (Demo API para propósitos de prueba).
Dependencias de Desarrollo
Jasmine: Framework para pruebas unitarias.
Karma: Herramienta para ejecutar pruebas.
Enlace al Repositorio
Encuentra el código fuente del proyecto en GitHub:
TeLlevoApp Repository

Entregables
Informe del Proyecto: Documentación completa del desarrollo.
Enlace al Repositorio de GitHub: Incluye el código fuente y documentación.
Archivo APK: Generado desde Android Studio para pruebas.
Código Fuente: Incluido como archivo comprimido (.zip o .tar.gz)
