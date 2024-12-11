// Importa la función `createApp` desde Vue para inicializar la aplicación.
import { createApp } from 'vue';

// Importa el componente raíz `App.vue`, que será el punto de entrada de la aplicación.
import App from './App.vue';

// Importa el archivo de configuración del enrutador para manejar las rutas de la aplicación.
import router from './router';

// Importa el plugin de Google Login.
import vue3GoogleLogin from 'vue3-google-login';

// Crea una instancia de la aplicación Vue, registra el enrutador, configura Google Login y monta la aplicación en el elemento con el ID 'app'.
createApp(App)
  .use(router) // Configura el enrutador para gestionar la navegación en la aplicación.
  .use(vue3GoogleLogin, {
    clientId: '546286542701-9bralu7ha7hljn18ll5ci5kn8j1t9jia.apps.googleusercontent.com', // Reemplaza con tu Client ID de Google obtenido en Google Cloud Console.
  }) // Configura el plugin de Google Login.
  .mount('#app'); // Monta la aplicación en el elemento con el ID 'app' en el archivo HTML.