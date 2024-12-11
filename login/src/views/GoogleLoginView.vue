<template>
  <div class="google-login-container">
    <h2 class="text-center">Iniciar sesión con Google</h2>
    <!-- Botón para el inicio de sesión con Google -->
    <GoogleLogin 
      :callback="handleGoogleLogin"
      class="btn btn-lg btn-primary"
      prompt
      auto-login
    />
    <!-- Mensaje de error si el inicio de sesión falla -->
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue'; // Importa `ref` desde Vue

// Función personalizada para decodificar JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Obtiene la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Error al decodificar el token JWT:", err);
    return null;
  }
};

export default {
  name: "GoogleLoginView",
  setup() {
    const router = useRouter();
    const error = ref('');

    const handleGoogleLogin = (response) => {
      try {
        console.log("Google login response:", response);

        // Extrae y decodifica el token de Google
        const { credential } = response;
        if (credential) {
          const user = decodeJWT(credential); // Decodifica el token de Google
          console.log("Datos decodificados del usuario:", user);

          if (user) {
            // Guarda la información del usuario en localStorage
            localStorage.setItem(
              'googleUserData',
              JSON.stringify({
                name: user.name,
                email: user.email,
                picture: user.picture,
              })
            );

            // Redirige a la vista del usuario
            router.push('/usuarioGoogle');
          } else {
            error.value = 'Error al decodificar el token de Google';
          }
        } else {
          error.value = 'No se pudo autenticar con Google';
        }
      } catch (err) {
        console.error('Error durante el inicio de sesión con Google:', err);
        error.value = 'Error durante el inicio de sesión con Google.';
      }
    };

    return {
      handleGoogleLogin,
      error,
    };
  },
};
</script>

<style scoped>
.google-login-container {
  display: flex;
  flex-direction: column; /* Coloca los elementos en columna */
  align-items: center; /* Centra horizontalmente */
  justify-content: center; /* Centra verticalmente si el contenedor tiene altura suficiente */
  height: 100vh; /* Altura completa de la ventana para centrar verticalmente */
  text-align: center; /* Centra el texto dentro del contenedor */
}

h2 {
  margin-bottom: 20px; /* Espaciado entre el título y el botón */
}

.btn {
  width: auto; /* Asegura que el botón no ocupe toda la línea */
}
</style>