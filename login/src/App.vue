<template>
  <!-- Contenedor principal de la aplicación -->
  <div id="app">
    <!-- Contenedor para enlaces de navegación y otros elementos principales -->
    <div class="container">
      <!-- Enlace de navegación utilizando Vue Router para la ruta raíz -->
      <router-link to="/" class="nav-link"></router-link>
    </div>
  </div>
  <!-- Vista del enrutador que mostrará el componente correspondiente a la ruta activa -->
  <router-view/>
</template>

<style>
/* Importa el archivo CSS de Bootstrap para aplicar estilos de Bootstrap en toda la aplicación */
@import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
</style>