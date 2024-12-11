<template>
  <div class="page-container">
    <!-- Mensaje de bienvenida -->
    <h1 v-if="userData" class="welcome-message">Bienvenido {{ userData.nombre }}</h1>

    <!-- Contenedor de la foto de perfil -->
    <div class="profile-photo-container">
      <!-- Mostrar foto de perfil si está disponible -->
      <img 
        v-if="userData && userData.fotoPerfil" 
        :src="'data:image/png;base64,' + userData.fotoPerfil" 
        alt="Foto de Perfil" 
        class="profile-photo" 
      />
      
      <!-- Botón para modificar la foto de perfil -->
      <div class="edit-photo-container">
        <input 
          type="file" 
          id="fileInput" 
          class="file-input" 
          @change="onFileChange" 
          accept="image/*" 
          hidden 
        />
        <button @click="triggerFileInput" class="edit-photo-button">Cambiar Foto de Perfil</button>
      </div>
    </div>

    <!-- Tabla de información del usuario -->
    <div class="table-container">
      <table v-if="userData" class="styled-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ userData.nombre }}</td>
            <td>{{ userData.apellidoPaterno }}</td>
            <td>{{ userData.apellidoMaterno }}</td>
            <td>{{ userData.correo }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Cargando datos...</p>
      
      <!-- Botón de acceso a la página de consulta de libros -->
      <button @click="goToBookSearch" class="edit-photo-button">Consulta Libros</button>
      <br><br>
      <button @click="goToMovieSearch" class="edit-photo-button">Consulta Peliculas</button>
      
      <!-- Botón para cerrar sesión -->
      <button @click="logout" class="logout-button">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userData: null, // Datos del usuario
      newPhoto: null, // Nueva foto seleccionada
    };
  },
  async created() {
    const userId = localStorage.getItem("userId"); // Obtiene el ID del usuario desde localStorage
    try {
      const response = await axios.get(`http://localhost:8080/cliente/getUserData/${userId}`);
      this.userData = response.data; // Almacena los datos del usuario
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  },
  methods: {
    // Método para cerrar sesión
    logout() {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      this.$router.push('/');
    },
    // Método para abrir el selector de archivos
    triggerFileInput() {
      document.getElementById("fileInput").click();
    },
    // Manejar el cambio de archivo
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          this.newPhoto = e.target.result.split(",")[1]; // Codificar en Base64
          await this.updatePhoto(); // Actualizar la foto de perfil
        };
        reader.readAsDataURL(file);
      }
    },
    // Enviar la nueva foto al backend
    async updatePhoto() {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.put(`http://localhost:8080/cliente/updatePhoto/${userId}`, {
          fotoPerfil: this.newPhoto,
        });
        if (response.status === 200) {
          this.userData.fotoPerfil = this.newPhoto; // Actualizar la foto en el frontend
          alert("Foto de perfil actualizada con éxito.");
        }
      } catch (error) {
        console.error("Error al actualizar la foto de perfil:", error);
        alert("Ocurrió un error al actualizar la foto de perfil.");
      }
    },
    // Método para redirigir a la página de consulta de libros
    goToBookSearch() {
      this.$router.push('/consultaLibros');
    },
    goToMovieSearch() {
      this.$router.push('/consultaPelis');
    },
  },
};
</script>


<style scoped>
/* Fondo de la página */
.page-container {
  background-color: #d1e0f3; /* Color de fondo */
  min-height: 100vh; /* Altura mínima para ocupar toda la pantalla */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Estilo del mensaje de bienvenida */
.welcome-message {
  font-size: 24px; /* Tamaño de fuente grande */
  font-weight: bold; /* Negrita */
  color: #4a4a4a; /* Color gris oscuro */
  margin-bottom: 20px; /* Espaciado inferior */
  font-family: Arial, sans-serif;
  text-align: center;
}

/* Contenedor de la tabla de usuario */
.table-container {
  background-color: #e6ecf7; /* Fondo claro */
  padding: 20px; /* Espaciado interno */
  border-radius: 10px; /* Bordes redondeados */
  width: 90%; /* Ancho relativo */
  max-width: 800px; /* Ancho máximo */
}

/* Estilo de la tabla */
.styled-table {
  width: 100%; /* Ancho completo */
  border-collapse: collapse; /* Quita espacio entre bordes */
  font-family: Arial, sans-serif;
  margin-top: 20px; /* Margen superior */
}

.styled-table thead tr {
  background-color: #5e79e8; /* Fondo azul para encabezado */
  color: #ffffff; /* Texto blanco */
  text-align: left; /* Alineación izquierda */
}

.styled-table th,
.styled-table td {
  padding: 12px 15px; /* Espaciado interno */
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd; /* Línea de separación */
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f4fc; /* Fondo alternado */
}

.styled-table tbody tr:hover {
  background-color: #e1e5f9; /* Fondo al pasar el mouse */
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #5e79e8; /* Línea inferior de la tabla */
}

.styled-table th {
  font-weight: bold; /* Encabezados en negrita */
}

/* Botón de cierre de sesión */
.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff; /* Texto blanco */
  background-color: #5e79e8; /* Fondo azul */
  border: none;
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cursor de clic */
}

.logout-button:hover {
  background-color: #4c68c9; /* Fondo más oscuro al pasar el mouse */
}

/* Contenedor para centrar la foto de perfil */
.profile-photo-container {
    text-align: center;
    margin-bottom: 20px;
}

/* Estilos para la foto de perfil */
.profile-photo {
    width: 150px; /* Establecer un tamaño fijo para el círculo */
    height: 150px; /* Establecer una altura fija igual al ancho */
    border-radius: 50%; /* Crear el efecto circular */
    object-fit: contain; /* Ajustar la imagen para mostrar la mayor parte */
    object-position: center; /* Centrar la imagen dentro del círculo */
    border: 3px solid #ccc; /* Opcional: Borde para resaltar */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Opcional: Sombra para dar profundidad */
    background-color: #f0f0f0; /* Fondo gris claro para mejorar contraste */
    overflow: hidden; /* Asegurar que nada se salga del círculo */
}

/* Ajustes para pantallas más grandes */
@media screen and (min-width: 768px) {
    .profile-photo {
        width: 200px; /* Aumentar el tamaño del círculo en pantallas grandes */
        height: 200px;
    }
}

/* Ajustes para pantallas pequeñas */
@media screen and (max-width: 480px) {
    .profile-photo {
        width: 100px; /* Reducir el tamaño del círculo en pantallas pequeñas */
        height: 100px;
    }
}

/* Botón para cambiar foto de perfil */
.edit-photo-container {
    margin-top: 10px;
}

.edit-photo-button {
    background-color: #5e79e8; /* Fondo azul */
    color: #ffffff; /* Texto blanco */
    border: none; /* Sin borde */
    padding: 10px 20px; /* Espaciado interno */
    font-size: 16px; /* Tamaño de fuente */
    border-radius: 5px; /* Bordes redondeados */
    cursor: pointer; /* Cambiar cursor a mano */
    transition: background-color 0.3s ease; /* Efecto de transición */
}

.edit-photo-button:hover {
    background-color: #4c68c9; /* Fondo más oscuro al pasar el mouse */
}

.edit-photo-button:focus {
    outline: none; /* Quitar contorno predeterminado */
    box-shadow: 0 0 5px #5e79e8; /* Resaltar el botón */
}

/* Ajustes para pantallas pequeñas */
@media screen and (max-width: 480px) {
    .edit-photo-button {
        font-size: 14px; /* Reducir tamaño de fuente */
        padding: 8px 16px; /* Reducir espaciado interno */
    }
}

/* Botón para acceder a la consulta de libros */
.consulta-libros-button {
  background-color: #5e79e8; /* Fondo azul */
  color: #ffffff; /* Texto blanco */
  border: none; /* Sin borde */
  padding: 10px 20px; /* Espaciado interno */
  font-size: 16px; /* Tamaño de fuente */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambiar cursor a mano */
  transition: background-color 0.3s ease; /* Efecto de transición */
}

.consulta-libros-button:hover {
  background-color: #4c68c9; /* Fondo más oscuro al pasar el mouse */
}

.consulta-libros-button:focus {
  outline: none; /* Quitar contorno predeterminado */
  box-shadow: 0 0 5px #5e79e8; /* Resaltar el botón */
}
</style>