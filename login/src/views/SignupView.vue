<template>
  <div class="container">
    <div class="wrapper">
      <form class="form-signin" @submit.prevent="signup">       
        <h2 class="form-signin-heading text-center">Ingrese sus datos</h2>
        
        <br><h6>Nombre*</h6>
        <input type="text" class="form-control" v-model="nombre" placeholder="Nombre" required autofocus />
        
        <br><h6>Apellido Paterno</h6>
        <input type="text" class="form-control" v-model="aPaterno" placeholder="Apellido Paterno" />
        
        <br><h6>Apellido Materno</h6>
        <input type="text" class="form-control" v-model="aMaterno" placeholder="Apellido Materno" />
        
        <br><h6>Correo Electrónico*</h6>
        <input type="text" class="form-control" v-model="email" placeholder="Correo Electrónico" required />
        
        <br><h6>Contraseña*</h6>
        <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required />

        <!-- Botón para subir la foto de perfil -->
        <br><h6>Foto de Perfil</h6>
        <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
        <p v-if="fileName" class="text-info">Archivo seleccionado: {{ fileName }}</p>
        
        <button class="btn btn-lg btn-primary btn-block" type="submit">Registrarse</button>
        
        <p v-if="error" class="text-danger">{{ error }}</p>
        <p v-if="success" class="text-success">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      aPaterno: '',
      aMaterno: '',
      email: '',
      password: '',
      fotoPerfil: null, // Variable para almacenar el archivo de imagen
      fileName: '', // Nombre del archivo seleccionado
      error: '',
      success: ''
    }
  },
  methods: {
    // Método que maneja el cambio de archivo en el input
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fotoPerfil = e.target.result.split(',')[1]; // Extrae el contenido Base64
        };
        reader.readAsDataURL(file); // Leer el archivo como Data URL
        this.fileName = file.name; // Guardar el nombre del archivo
      }
    },
    async signup() {
      if (!this.nombre || !this.email || !this.password) {
        this.error = 'Por favor, complete los campos obligatorios.';
        return;
      }

      const userData = {
        nombre: this.nombre,
        apellidoPaterno: this.aPaterno || null,
        apellidoMaterno: this.aMaterno || null,
        correo: this.email,
        contrasena: this.password,
        fotoPerfil: this.fotoPerfil // La imagen en Base64
      };

      try {
        const response = await axios.post('http://localhost:8080/cliente/saveUser', userData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
          this.success = 'Registro exitoso, redirigiendo...';
          this.error = '';
          setTimeout(() => this.$router.push('/'), 2000);
        } else {
          this.error = 'Ocurrió un error durante el registro.';
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data === "El correo ya está en uso.") {
          // Mostrar mensaje claro si el correo está duplicado
          this.error = 'El correo ingresado ya está en uso.';
        } else {
          // Mensaje genérico para otros errores
          this.error = 'Error al conectar con el servidor.';
        }
      }
    }
  }
}
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

  /* Estilos para el formulario de registro */
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
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 10px;
  }

  /* Estilos específicos para inputs de texto y contraseña */
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
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Estilos para mensajes de texto de error y éxito */
  .text-danger {
    color: red;
  }

  .text-success {
    color: green;
  }

  .text-center {
    text-align: center;
  }

  input[type="file"] {
    border: none;
    padding: 10px 0;
    font-size: 16px;
  }
  .text-info {
    color: #007bff;
    font-style: italic;
  }
</style>