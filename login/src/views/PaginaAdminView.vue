<template>
    <div class="page-container">
        <br>
        <h1 class="welcome-message">Bienvenido Admin</h1>

        <div class="table-container" style="text-align: center;">
            <table v-if="users.length" class="styled-table">
                <thead>
                    <tr style="text-align: center;">
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo</th>
                        <th>Foto de Perfil</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id_cliente">
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellidoPaterno }}</td>
                        <td>{{ user.apellidoMaterno }}</td>
                        <td>{{ user.correo }}</td>
                        <td>
                            <div v-if="user.fotoPerfil" class="profile-photo-container">
                                <img :src="'data:image/png;base64,' + user.fotoPerfil" alt="Foto de Perfil" class="profile-photo" />
                            </div>
                            <div v-else class="no-photo">Sin Foto</div>
                        </td>
                        <td>
                            <button @click="confirmDelete(user.correo)" class="button button-primary">Eliminar</button>
                            <button @click="openEditModal(user)" class="button button-secondary">Modificar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Cargando datos...</p>

            <br>
            <button @click="toggleModal(true)" class="button button-primary">Registrar Usuario</button>

            <div v-if="showDeleteModal" class="modal-overlay">
                <div class="modal-content">
                    <p>¿Estás seguro de que deseas eliminar al usuario con correo {{ userToDeleteEmail }}?</p>
                    <button @click="deleteUser" class="button button-delete">Eliminar Permanentemente</button>
                    <button @click="closeDeleteModal" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                    <h2 class="form-title">Registrar Usuario</h2>
                    <form @submit.prevent="registerUser">
                        <div v-for="field in fields" :key="field.model" class="form-group">
                            <input 
                                :type="field.type" 
                                v-model="newUser[field.model]" 
                                :placeholder="field.placeholder" 
                                :required="field.required" 
                            />
                        </div>
                        <div class="form-group">
                            <select v-model="newUser.rol" required>
                                <option value="1">Usuario</option>
                                <option value="2">Administrador</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="fotoPerfil">Foto de Perfil</label>
                            <input type="file" id="fotoPerfil" @change="onFileChange" accept="image/*" />
                            <p v-if="fileName" class="text-info">Archivo seleccionado: {{ fileName }}</p>
                        </div>
                        <button type="submit" class="button button-primary">Registrar</button>
                    </form>
                    <button @click="toggleModal(false)" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <div v-if="showEditModal" class="modal-overlay">
                <div class="modal-content">
                    <h2 class="form-title">Modificar Usuario</h2>
                    <form @submit.prevent="updateUser">
                        <div v-for="field in fields" :key="field.model" class="form-group">
                            <input 
                                :type="field.type" 
                                v-model="editUser[field.model]" 
                                :placeholder="field.placeholder" 
                                :required="field.required" 
                            />
                        </div>
                        <div class="form-group">
                            <select v-model="editUser.rol" required>
                                <option value="1">Usuario</option>
                                <option value="2">Administrador</option>
                            </select>
                        </div>
                        <!-- Nuevo campo para modificar la foto de perfil -->
                        <div class="form-group">
                            <label for="editFotoPerfil">Foto de Perfil</label>
                            <input 
                                type="file" 
                                id="editFotoPerfil" 
                                @change="onEditFileChange" 
                                accept="image/*" 
                            />
                            <p v-if="editFileName" class="text-info">Archivo seleccionado: {{ editFileName }}</p>
                            <p v-else class="text-secondary">No seleccionada: Se mantendrá la actual</p>
                        </div>
                        <button type="submit" class="button button-primary">Modificar Permanentemente</button>
                    </form>
                    <button @click="closeEditModal" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <button @click="logout" class="button button-primary logout-button">Cerrar Sesión</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            newUser: this.getNewUserTemplate(),
            editUser: {}, // Datos del usuario que se está editando
            showModal: false,
            showDeleteModal: false,
            showEditModal: false,
            userToDeleteEmail: null,
            fileName: '', // Nombre del archivo de la foto seleccionada para registro
            fotoPerfil: null, // Foto de perfil en Base64 para registro
            editFileName: '', // Nombre del archivo de la foto seleccionada para edición
            editFotoPerfil: null, // Foto de perfil en Base64 para edición
            fields: [
                { name: 'nombre', model: 'nombre', placeholder: 'Nombre', type: 'text', required: true },
                { name: 'apellidoPaterno', model: 'apellidoPaterno', placeholder: 'Apellido Paterno', type: 'text', required: false },
                { name: 'apellidoMaterno', model: 'apellidoMaterno', placeholder: 'Apellido Materno', type: 'text', required: false },
                { name: 'correo', model: 'correo', placeholder: 'Correo', type: 'email', required: true },
                { name: 'contrasena', model: 'contrasena', placeholder: 'Contraseña', type: 'password', required: true }
            ]
        };
    },
    async created() {
        this.fetchUsers();
    },
    methods: {
        getNewUserTemplate() {
            return {
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                correo: '',
                contrasena: '',
                rol: '1',
                fotoPerfil: null // Campo para la foto de perfil
            };
        },
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:8080/cliente/getAllUsers');
                this.users = response.data;
            } catch (error) {
                console.error('Error al obtener los datos de los usuarios:', error);
            }
        },
        async registerUser() {
            try {
                const userData = { ...this.newUser, fotoPerfil: this.fotoPerfil }; // Incluye la foto en el registro
                await axios.post('http://localhost:8080/cliente/saveUser', userData);
                alert('Usuario registrado exitosamente');
                this.newUser = this.getNewUserTemplate();
                this.fotoPerfil = null; // Limpia la foto seleccionada
                this.fileName = ''; // Limpia el nombre del archivo
                this.fetchUsers();
                this.toggleModal(false);
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
            }
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.fotoPerfil = e.target.result.split(',')[1]; // Extrae el contenido Base64
                };
                reader.readAsDataURL(file); // Lee el archivo como Data URL
                this.fileName = file.name; // Guarda el nombre del archivo
            }
        },
        onEditFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.editFotoPerfil = e.target.result.split(',')[1]; // Extrae el contenido Base64
                };
                reader.readAsDataURL(file); // Lee el archivo como Data URL
                this.editFileName = file.name; // Guarda el nombre del archivo
            } else {
                this.editFotoPerfil = null; // Limpia la foto si se deselecciona
                this.editFileName = '';
            }
        },
        toggleModal(show) {
            this.showModal = show;
        },
        confirmDelete(userEmail) {
            this.userToDeleteEmail = userEmail;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.userToDeleteEmail = null;
        },
        async deleteUser() {
            try {
                await axios.delete('http://localhost:8080/cliente/deleteUserByEmail', { data: { correo: this.userToDeleteEmail } });
                alert('Usuario eliminado exitosamente');
                this.fetchUsers();
                this.closeDeleteModal();
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        },
        openEditModal(user) {
            this.editUser = { ...user }; // Carga los datos actuales del usuario
            this.editFotoPerfil = null; // Resetea la foto seleccionada
            this.editFileName = ''; // Resetea el nombre del archivo
            this.showEditModal = true;
        },
        async updateUser() {
            try {
                const updatedUser = { ...this.editUser }; // Copia los datos del usuario en edición
                if (this.editFotoPerfil) {
                    updatedUser.fotoPerfil = this.editFotoPerfil; // Incluye la nueva foto si se selecciona
                }
                await axios.put('http://localhost:8080/cliente/updateUserByEmail', updatedUser);
                alert('Usuario modificado exitosamente');
                this.fetchUsers();
                this.closeEditModal();
            } catch (error) {
                console.error('Error al modificar el usuario:', error);
            }
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editUser = {};
            this.editFotoPerfil = null; // Limpia la foto seleccionada
            this.editFileName = ''; // Limpia el nombre del archivo
        },
        logout() {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
/* Fondo de la página */
.page-container {
    background-color: #d1e0f3; /* Fondo suave */
    min-height: 100vh; /* Altura mínima de la página */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px; /* Espaciado interno */
}

/* Mensaje de bienvenida */
.welcome-message {
    font-size: 24px; /* Tamaño destacado */
    font-weight: bold; /* Texto en negrita */
    color: #4a4a4a; /* Color gris oscuro */
    margin-bottom: 20px; /* Espaciado inferior */
    text-align: center; /* Centrado */
}

/* Contenedor de la tabla */
.table-container {
    background-color: #e6ecf7; /* Fondo claro */
    padding: 20px; /* Espaciado interno */
    border-radius: 10px; /* Bordes redondeados */
    width: 90%; /* Ancho relativo */
    max-width: 1000px; /* Ancho máximo */
    overflow-x: auto; /* Habilitar scroll horizontal si es necesario */
}

/* Estilo de la tabla */
.styled-table {
    width: 100%; /* Ancho completo */
    border-collapse: collapse; /* Sin separación entre bordes */
    table-layout: fixed; /* Columnas de ancho fijo */
    font-family: Arial, sans-serif;
}

.styled-table thead tr {
    background-color: #5e79e8; /* Color azul */
    color: #ffffff; /* Texto blanco */
}

.styled-table th,
.styled-table td {
    padding: 12px 10px; /* Espaciado interno */
    text-align: center; /* Centrado */
    word-wrap: break-word; /* Ajustar texto largo */
    overflow: hidden; /* Ocultar desbordes */
}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd; /* Línea separadora */
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f4fc; /* Fondo alternado */
}

.styled-table tbody tr:hover {
    background-color: #e1e5f9; /* Fondo al pasar el mouse */
}

/* Botones */
.button {
    padding: 8px 12px; /* Espaciado interno */
    font-size: 14px; /* Tamaño de texto */
    border: none; /* Sin borde */
    border-radius: 5px; /* Bordes redondeados */
    cursor: pointer; /* Cursor tipo clic */
    margin: 5px; /* Separación entre botones */
}

.button-primary {
    background-color: #5e79e8; /* Azul */
    color: #ffffff; /* Texto blanco */
}

.button-primary:hover {
    background-color: #4c68c9; /* Azul oscuro */
}

.button-secondary {
    background-color: #95a5a6; /* Gris */
    color: #ffffff; /* Texto blanco */
}

.button-secondary:hover {
    background-color: #7f8c8d; /* Gris oscuro */
}

.button-delete {
    background-color: #e74c3c; /* Rojo */
    color: #ffffff; /* Texto blanco */
}

.button-delete:hover {
    background-color: #c0392b; /* Rojo oscuro */
}

/* Foto de perfil */
.profile-photo-container {
    text-align: center; /* Centrar la foto */
}

.profile-photo {
    width: 100px; /* Tamaño aumentado */
    height: 100px; /* Igual que el ancho */
    border-radius: 50%; /* Forma circular */
    object-fit: cover; /* Ajustar la imagen */
    border: 2px solid #ccc; /* Borde gris */
    margin: auto; /* Centrar dentro de la celda */
}

/* Modal */
.modal-overlay {
    position: fixed; /* Posición fija */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
    display: flex; /* Flexbox */
    align-items: center;
    justify-content: center; /* Centrar el contenido */
}

.modal-content {
    background-color: #f3f4fc; /* Fondo claro */
    padding: 20px; /* Espaciado interno */
    border-radius: 10px; /* Bordes redondeados */
    width: 90%; /* Ancho relativo */
    max-width: 500px; /* Ancho máximo */
}

/* Inputs en formularios */
.form-group input,
.form-group select {
    width: 100%; /* Ancho completo */
    padding: 10px; /* Espaciado interno */
    margin-bottom: 15px; /* Espaciado inferior */
    border: 1px solid #cccccc; /* Borde gris claro */
    border-radius: 5px; /* Bordes redondeados */
    font-size: 14px; /* Tamaño de fuente */
}
</style>