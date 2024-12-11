<template>
    <div class="usuario-google-container">
      <img :src="userData.picture" alt="Foto de perfil" class="foto-perfil" />
      <h2>{{ userData.name }}</h2>
      <p>{{ userData.email }}</p>
      <button @click="goToBookSearch" class="btn">Consulta Libros</button>
      <button @click="goToMovieSearch" class="btn">Consulta Peliculas</button>
      <!-- Botón para cerrar sesión -->
      <button @click="logout" class="btn-logout">Cerrar sesión</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: "UsuarioGoogleView",
    setup() {
      const router = useRouter();
      const userData = ref({
        name: '',
        email: '',
        picture: '',
      });
  
      // Cargar datos del usuario desde localStorage
      onMounted(() => {
        const googleUserData = localStorage.getItem('googleUserData');
        if (googleUserData) {
          userData.value = JSON.parse(googleUserData);
        } else {
          console.error("No se encontró información del usuario en localStorage.");
        }
      });
  
      // Método para cerrar sesión
      const logout = () => {
        localStorage.removeItem('googleUserData'); // Elimina los datos del usuario
        router.push('/googleLogin'); // Redirige al inicio de sesión
      };
  
      return {
        userData,
        logout,
      };
    },
    methods: {
        goToBookSearch() {
        this.$router.push('/consultaLibros');
        },
        goToMovieSearch() {
        this.$router.push('/consultaPelis');
        },
    }
  };
  </script>
  
  <style scoped>
  .usuario-google-container {
    background-color: #a1a0a0;
    display: flex;
    flex-direction: column; /* Elementos en columna */
    align-items: center; /* Centrado horizontal */
    justify-content: center; /* Centrado vertical */
    height: 100vh; /* Altura completa de la ventana */
    text-align: center; /* Centra el texto */
  }
  
  .foto-perfil {
    width: 150px; /* Tamaño de la imagen */
    height: 150px;
    border-radius: 50%; /* Hace que la imagen sea redonda */
    margin-bottom: 20px; /* Espaciado entre la imagen y el nombre */
  }
  
  h2 {
    margin-bottom: 10px; /* Espaciado entre el nombre y el correo */
  }
  
  p {
    font-size: 1rem; /* Tamaño de fuente del correo */
    color: #555; /* Color del texto */
  }
  .btn{
    margin-top: 20px; /* Espaciado entre el botón y el resto del contenido */
    padding: 10px 20px; /* Tamaño del botón */
    font-size: 1rem; /* Tamaño del texto */
    color: white;
    background-color: cadetblue;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: auto; /* Botón con ancho automático */
    max-width: 200px; /* Limita el ancho máximo */
  }
  
  .btn-logout {
    margin-top: 20px; /* Espaciado entre el botón y el resto del contenido */
    padding: 10px 20px; /* Tamaño del botón */
    font-size: 1rem; /* Tamaño del texto */
    color: white;
    background-color: #d9534f; /* Rojo para indicar "Cerrar sesión" */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: auto; /* Botón con ancho automático */
    max-width: 200px; /* Limita el ancho máximo */
  }
  
  .btn-logout:hover {
    background-color: #c9302c; /* Más oscuro al pasar el mouse */
  }
  </style>  