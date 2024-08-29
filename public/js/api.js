// js/api.js

// Función para manejar el envío del formulario de inicio de sesión
async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.querySelector('#login-email').value;
    const contraseña = document.querySelector('#login-password').value;

    console.log('Datos de inicio de sesión:', { email, contraseña }); // Mostrar datos de entrada

    try {
        console.log('Enviando solicitud de inicio de sesión...');

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contraseña })
        });

        console.log('Respuesta recibida del servidor:', response); // Mostrar respuesta cruda del servidor

        if (response.ok) {
            const data = await response.json();
            console.log('Datos recibidos:', data); // Mostrar los datos recibidos del servidor

            // Guardar las variables de sesión
            sessionStorage.setItem('tipo', data.tipo);
            sessionStorage.setItem('nombre', data.nombre); // Asumiendo que 'nombre' es el nombre del comerciante
            sessionStorage.setItem('Id', data.Id); // Asumiendo que 'id' es el ID del comerciante

            console.log('Variables de sesión guardadas:', {
                tipo: data.tipo,
                nombre: data.nombre,
                Id: data.Id
            });

            alert(data.mensaje);
            
            // Redirigir según el tipo de usuario
            if (data.tipo === 'comerciante') {
                console.log('Redirigiendo a la página del comerciante...');
                window.location.href = 'index-comer.html?mensaje=Comerciante autenticado exitosamente';
            } else {
                console.log('Redirigiendo a la página del usuario...');
                window.location.href = 'index.html?mensaje=Usuario autenticado exitosamente';
            }
        } else {
            const errorData = await response.json();
            console.error('Error en la respuesta del servidor:', errorData); // Mostrar error devuelto por el servidor
            alert(errorData.error);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error); // Mostrar error de la solicitud
        alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
}


// Función para manejar el registro de un nuevo usuario
async function registrarUsuario(event) {
    event.preventDefault();

    const data = {
        nombre: document.getElementById('input-usuario').value,
        email: document.getElementById('input-email').value,
        contraseña: document.getElementById('input-password').value,
        direccion: document.getElementById('input-direccion').value,
        telefono: document.getElementById('input-telefono').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Registrado!',
                text: 'Usuario registrado exitosamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'index.html'; // Redirige al inicio después de la confirmación
                }
            });
        } else {
            const errorData = await response.json();
            Swal.fire({
                title: 'Error',
                text: errorData.message, // Mostrando el mensaje de error desde el servidor
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al registrar el usuario. Por favor, intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Añadir eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('form#form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    const formRegistro = document.querySelector('form#form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarUsuario);
    }
});
