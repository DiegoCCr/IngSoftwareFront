<template>
    <div class="consulta-pelis-container">
      <h1 class="title">Consulta de Películas</h1>
  
      <!-- Barra de búsqueda simplificada -->
      <div class="search-bar-simplified">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar películas..." 
          class="search-input-simplified"
        />
        <button @click="searchMovies" class="search-button-simplified">
          <img src="https://cdn-icons-png.flaticon.com/512/49/49116.png" alt="Buscar" class="search-icon" />
        </button>
      </div>
  
      <!-- Resultados de la búsqueda -->
      <div v-if="movies.length" class="movies-grid">
        <div v-for="movie in movies" :key="movie.show.id" class="movie-card">
          <!-- Imagen de la película -->
          <img 
            v-if="movie.show.image" 
            :src="movie.show.image.medium" 
            alt="Imagen de la película" 
            class="movie-cover" 
          />
          <div v-else class="no-cover">Sin Imagen</div>
  
          <!-- Información de la película -->
          <h2 class="movie-title">{{ movie.show.name }}</h2>
          <p class="movie-summary" v-html="movie.show.summary || 'Sin descripción disponible.'"></p>
        </div>
      </div>
  
      <!-- Mensaje si no hay resultados -->
      <p v-else-if="noResults">No se encontraron películas para la búsqueda.</p>
      <br>
      <button @click="goBack" class="edit-photo-button">Regresar</button>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        searchQuery: "", // Consulta de búsqueda
        movies: [], // Lista de películas
        noResults: false, // Bandera para resultados vacíos
      };
    },
    methods: {
      async searchMovies() {
        if (!this.searchQuery) {
          alert("Por favor, ingresa un término de búsqueda.");
          return;
        }
  
        try {
          // Realizar la solicitud a la API de TVmaze
          const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${this.searchQuery}`);
          this.movies = response.data;
          this.noResults = this.movies.length === 0;
        } catch (error) {
          console.error("Error al buscar películas:", error);
          alert("Ocurrió un error al buscar las películas. Inténtalo nuevamente.");
        }
      }
    },
    setup(){
  const router = useRouter();
  const goBack = () => {
      router.back(); // Regresa a la página anterior
    };
  return{
    goBack
  }
}
  };
  </script>
  
  <style scoped>
  .consulta-pelis-container {
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }
  
  /* Barra de búsqueda compacta */
  .search-bar-simplified {
    display: flex;
    align-items: center;
    width: 25%; /* Mantener el ancho compacto */
    background-color: #ffffff; /* Fondo blanco */
    border-radius: 15px; /* Bordes redondeados */
    padding: 5px; /* Espaciado interno ajustado */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave */
    margin: 10px auto; /* Centrar en la página */
  }
  
  .search-input-simplified {
    flex: 1; /* Ocupa todo el espacio disponible */
    border: none; /* Sin bordes */
    outline: none; /* Sin contorno al seleccionar */
    font-size: 14px; /* Tamaño reducido */
    padding: 5px; /* Espaciado interno ajustado */
  }
  
  .search-button-simplified {
    background: none; /* Sin fondo adicional */
    border: none; /* Sin bordes */
    cursor: pointer; /* Cambia el cursor */
    padding: 0; /* Sin espaciado interno */
    width: 20px; /* Reducir el ancho del botón */
    height: 20px; /* Reducir la altura del botón */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .search-icon {
    width: 14px; /* Reducir el tamaño del ícono */
    height: 14px;
    opacity: 0.6; /* Suavizar el color */
  }
  
  /* Grid de resultados */
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .movie-card {
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
  }
  
  .movie-cover {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
  }
  
  .no-cover {
    width: 100%;
    height: 150px;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
  }
  
  .movie-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 5px 0;
  }
  
  .movie-summary {
    font-size: 14px;
    color: #666;
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
  </style>  