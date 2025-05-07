# Teatro Instituto Leopoldo Lugones

Un sitio web responsive de una sola página para promocionar el evento teatral "Sueños de Otoño" del Instituto Leopoldo Lugones.

## Características

- Diseño responsive optimizado para dispositivos móviles
- Hero fullscreen con imagen de fondo y flechas animadas
- Navegación lateral con puntos indicadores
- Secciones para información del evento, horarios y ubicación
- Mapa interactivo de Google Maps
- Microanimaciones suaves y transiciones de scroll
- Optimización para SEO móvil

## Tecnologías utilizadas

- HTML5
- CSS3 (animaciones, flexbox, grid)
- JavaScript puro (sin frameworks)
- Google Fonts
- Font Awesome para iconos

## Estructura del proyecto

```
teatro-lugones/
├── css/
│   └── styles.css
├── images/
│   └── teatro-hero.jpg
├── js/
│   └── main.js
├── index.html
└── README.md
```

## Instrucciones de despliegue

### Opción 1: AWS Amplify

1. Crea una cuenta en AWS si aún no tienes una
2. Instala la CLI de AWS Amplify:
   ```
   npm install -g @aws-amplify/cli
   aws configure
   ```

3. Inicializa tu proyecto:
   ```
   amplify init
   ```

4. Publica tu sitio web:
   ```
   amplify add hosting
   amplify publish
   ```

5. Para configurar un dominio personalizado:
   ```
   amplify add domain
   ```

### Opción 2: Firebase Hosting

1. Crea una cuenta en Firebase si aún no tienes una
2. Instala Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

3. Inicia sesión en Firebase:
   ```
   firebase login
   ```

4. Inicializa tu proyecto:
   ```
   firebase init
   ```
   - Selecciona "Hosting"
   - Selecciona tu proyecto o crea uno nuevo
   - Especifica "." como directorio público
   - Configura como aplicación de una sola página: "No"

5. Despliega tu sitio:
   ```
   firebase deploy
   ```

6. Para configurar un dominio personalizado, ve a la consola de Firebase > Hosting > Conectar dominio

## Optimización adicional

Para mejorar aún más el rendimiento del sitio:

1. Comprime las imágenes con herramientas como TinyPNG
2. Minifica los archivos CSS y JavaScript:
   ```
   npm install -g minify
   minify styles.css > styles.min.css
   minify main.js > main.min.js
   ```
   Luego actualiza los enlaces en index.html

3. Utiliza un CDN para entregar los archivos estáticos más rápidamente

## Contacto

Instituto Leopoldo Lugones
- Email: contacto@lugones.edu.ar
- Teléfono: (011) 4567-8900
