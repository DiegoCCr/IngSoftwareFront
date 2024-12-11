import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import PaginaAdminView from '../views/PaginaAdminView.vue';
import PaginaUsuarioView from '../views/PaginaUsuarioView.vue';
import ConsultaLibrosView from '../views/ConsultaLibrosView.vue'; // Importa la nueva vista
import ConsultaPelisView from '../views/ConsultaPelisView.vue';
import GoogleLoginView from '../views/GoogleLoginView.vue';
import UsuarioGoogleView from '../views/UsuarioGoogleView.vue';

// Definición de rutas de la aplicación
const routes = [
  { path: '/', name: 'login', component: LoginView }, // Ruta para la vista de login
  { path: '/signup', name: 'signup', component: SignupView }, // Ruta para la vista de registro
  { path: '/admin', name: 'PaginaAdminView', component: PaginaAdminView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/usuario', name: 'PaginaUsuarioView', component: PaginaUsuarioView, meta: { requiresAuth: true, role: 'user' } },
  { path: '/consultaLibros', name: 'ConsultaLibrosView', component: ConsultaLibrosView},
  { path: '/registrarse', redirect: '/signup' },
  { path: '/consultaPelis', name: 'ConsultaPelisView', component: ConsultaPelisView},
  { path: '/googleLogin', name: 'GoogleLogin', component: GoogleLoginView },
  { path: '/usuarioGoogle', name: 'UsuarioGoogle', component: UsuarioGoogleView }
];

// Creación de instancia de enrutador con historial de navegación
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Historial de navegación usando el BASE_URL del entorno
  routes // Asigna las rutas definidas al enrutador
});

// Guard de navegación para verificar autenticación y roles antes de cada cambio de ruta
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Verifica si el usuario está autenticado
  const userRole = localStorage.getItem("userRole"); // Obtiene el rol del usuario desde localStorage

  if (to.name === 'GoogleLogin') {
    // Permitir acceso directo a GoogleLogin sin validaciones
    next();
  } else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirige a login si la ruta requiere autenticación y el usuario no está autenticado
    next({ name: 'login' });
  } else if (to.meta.role === 'admin' && userRole !== 'admin') {
    // Redirige a la página de usuario si el rol es insuficiente para acceder a la ruta de administrador
    next({ name: 'PaginaUsuarioView' });
  } else if (to.meta.role === 'user' && userRole !== 'user') {
    // Redirige a la página de administrador si el rol es insuficiente para acceder a la ruta de usuario
    next({ name: 'PaginaAdminView' });
  } else {
    // Permite el acceso a la ruta si se cumplen las condiciones de autenticación y rol
    next();
  }
});

export default router;