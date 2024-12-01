// Importa la función `createApp` desde Vue para inicializar la aplicación.
import { createApp } from 'vue';

// Importa el componente raíz `App.vue`, que será el punto de entrada de la aplicación.
import App from './App.vue';

// Importa el archivo de configuración del enrutador para manejar las rutas de la aplicación.
import router from './router';

// Crea una instancia de la aplicación Vue, registra el enrutador y monta la aplicación en el elemento con el ID 'app'.
createApp(App)
  .use(router) // Configura el enrutador para gestionar la navegación en la aplicación.
  .mount('#app'); // Monta la aplicación en el elemento con el ID 'app' en el archivo HTML.