<template>
    <div class="consulta-libros-container">
      <h1 class="title">Consulta de Libros</h1>
  
      <!-- Barra de búsqueda simplificada -->
      <div class="search-bar-simplified">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar libros..." 
          class="search-input-simplified"
        />
        <button @click="searchBooks" class="search-button-simplified">
          <img src="https://cdn-icons-png.flaticon.com/512/49/49116.png" alt="Buscar" class="search-icon" />
        </button>
      </div>
  
      <!-- Resultados de la búsqueda -->
      <div v-if="books.length" class="books-grid">
        <div v-for="book in books" :key="book.key" class="book-card">
          <!-- Portada del libro -->
          <img 
            v-if="book.cover_i" 
            :src="'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg'" 
            alt="Portada del libro" 
            class="book-cover" 
          />
          <div v-else class="no-cover">Sin Portada</div>
  
          <!-- Información del libro -->
          <h2 class="book-title">{{ book.title }}</h2>
          <p class="book-author">
            Autor: {{ book.author_name ? book.author_name.join(', ') : 'Desconocido' }}
          </p>
          <p class="book-year">Año: {{ book.first_publish_year || 'Desconocido' }}</p>
        </div>
      </div>
  
      <!-- Mensaje si no hay resultados -->
      <p v-else-if="noResults">No se encontraron libros para la búsqueda.</p>
      <br>
      <button @click="goBack" class="edit-photo-button">Regresar</button>
    </div>
</template>  

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
data() {
    return {
    searchQuery: '', // Consulta de búsqueda
    books: [], // Lista de libros
    noResults: false, // Bandera para resultados vacíos
    };
},
methods: {
    async searchBooks() {
        if (!this.searchQuery) {
            alert('Por favor, ingresa un término de búsqueda.');
            return;
        }

        try {
            // Realizar la solicitud a la API de Open Library
            const response = await axios.get('https://openlibrary.org/search.json', {
            params: {
                q: this.searchQuery,
            },
            headers: {
                'User-Agent': 'ConsultaLibrosView (tuemail@dominio.com)', // Añade tu User-Agent
            },
            });

            this.books = response.data.docs;
            this.noResults = this.books.length === 0;
        } catch (error) {
            console.error('Error al buscar libros:', error);
            alert('Ocurrió un error al buscar los libros. Inténtalo nuevamente.');
        }
    },
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
.consulta-libros-container {
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
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.book-cover {
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

.book-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 5px 0;
}

.book-author,
.book-year {
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