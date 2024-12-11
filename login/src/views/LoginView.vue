<template>
  <div class="container">
    <div class="wrapper">
      <!-- Formulario de inicio de sesión con evento submit -->
      <form class="form-signin" @submit.prevent="login">
        <h2 class="form-signin-heading text-center">Ingrese sus datos</h2>
        <!-- Campo de entrada para correo electrónico -->
        <input type="text" class="form-control" v-model="email" placeholder="Correo electrónico" required autofocus />
        <!-- Campo de entrada para contraseña -->
        <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required />
        <!-- Botón de envío del formulario para iniciar sesión -->
        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button><br><br>

        <!-- Botón para iniciar sesión con Google -->
        <button 
          class="btn btn-lg btn-primary btn-block" 
          type="button" 
          @click="google"
        >
          Iniciar sesión con Google
        </button><br><br>

        <h5 class="text-center">¿No tienes una cuenta?</h5>
        <!-- Botón para redirigir a la página de registro -->
        <button 
          class="btn btn-lg btn-primary btn-block" 
          type="button" 
          @click="signup"
        >
          ¡Regístrate!
        </button>
        
        <!-- Muestra un mensaje de error si existe -->
        <p v-if="error" class="text-danger text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '', // Almacena el correo ingresado por el usuario
      password: '', // Almacena la contraseña ingresada por el usuario
      error: '' // Mensaje de error si la autenticación falla
    };
  },
  methods: {
    // Método para manejar el inicio de sesión
    async login() {
      // Validar si los campos están vacíos
      if (!this.email || !this.password) {
        this.error = 'Por favor llena todos los campos'; // Mostrar error si están vacíos
        return;
      }

      try {
        // Crear el objeto con los datos de autenticación
        const data = {
          correo: this.email,
          contrasena: this.password
        };

        // Enviar solicitud de autenticación al backend
        const response = await axios.post('http://localhost:8080/cliente/login', data);

        // Verificar si la autenticación fue exitosa
        if (response.status === 200 && response.data.success) {
          this.error = '';
          localStorage.setItem("isAuthenticated", "true"); // Guarda el estado de autenticación
          localStorage.setItem("userId", response.data.userId); // Guarda el userId en localStorage
          
          // Guarda el rol en localStorage y redirige a la página correspondiente
          const rol = response.data.rol;
          if (rol === 2) {
            localStorage.setItem("userRole", "admin");
            this.$router.push({ name: 'PaginaAdminView' }); // Redirigir a la vista de administrador
          } else if (rol === 1) {
            localStorage.setItem("userRole", "user");
            this.$router.push({ name: 'PaginaUsuarioView' }); // Redirigir a la vista de usuario
          }
        } else {
          this.error = 'Correo o contraseña incorrectos';
        }
      } catch (error) {
        this.error = 'Error al conectar con el servidor.';
      }
    },

    // Método para redirigir al usuario a la página de registro
    signup() {
      this.$router.push('/signup');
    },

    google() {
      this.$router.push({ name: 'GoogleLogin' }); // Asegúrate de que el nombre de la ruta sea correcto
    }
  }
};
</script>

<style>
  /* Estilos generales de la página */
  body {
    background: #eee !important;	
  }

  /* Contenedor principal */
  .wrapper {	
    margin-top: 80px;
    margin-bottom: 80px;
  }

  /* Estilos para el formulario de inicio de sesión */
  .form-signin {
    max-width: 380px;
    padding: 15px 35px 45px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.1); 
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1); /* Añadir sombra */
    border-radius: 10px; /* Bordes redondeados */
  }

  .form-signin-heading,
  .checkbox {
    margin-bottom: 30px;
  }

  .checkbox {
    font-weight: normal;
  }

  /* Estilos para los campos de entrada */
  .form-control {
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    box-sizing: border-box; /* Usar directamente box-sizing */
    width: 100%; /* Asegurar que el input ocupe todo el ancho */
    margin-bottom: 10px; /* Añadir espacio entre los inputs */
  }

  /* Especificar estilos para tipos de input */
  input[type="text"],
  input[type="password"] {
    margin-bottom: -1px;
    border-radius: 4px;
  }

  input[type="password"] {
    margin-bottom: 20px;
  }

  /* Estilos para los botones */
  button {
    width: 100%; /* Asegurar que el botón ocupe todo el ancho */
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #007bff; /* Color azul */
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3; /* Efecto hover */
  }

  /* Clase para centrar texto */
  .text-center {
    text-align: center;
  }
</style>