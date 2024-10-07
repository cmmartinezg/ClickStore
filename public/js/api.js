// js/api.js

// Función para manejar el envío del formulario de inicio de sesión
async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.querySelector('#login-email').value.trim();
    const contrasena = document.querySelector('#login-password').value.trim();

    // Validar que los campos no estén vacíos
    if (!email || !contrasena) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contrasena })
        });

        if (response.ok) {
            const data = await response.json();

            // Guardar las variables de sesión
            sessionStorage.setItem('tipo', data.tipo);
            sessionStorage.setItem('nombre', data.nombre);
            sessionStorage.setItem('id', data.Id); // Usar 'id' en minúscula

            alert(data.mensaje);

            // Redirigir según el tipo de usuario
            if (data.tipo === 'comerciante') {
                window.location.href = 'index-comer.html?mensaje=Comerciante autenticado exitosamente';
            } else {
                window.location.href = 'index.html?mensaje=Usuario autenticado exitosamente';
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
}


// Función para manejar el registro de un nuevo usuario
async function registrarUsuario(event) {
    event.preventDefault();

    const data = {
        nombre: document.getElementById('input-usuario').value.trim(),
        email: document.getElementById('input-email').value.trim(),
        contrasena: document.getElementById('input-password').value.trim(),
        direccion: document.getElementById('input-direccion').value.trim(),
        telefono: document.getElementById('input-telefono').value.trim()
    };

    // Validar que los campos no estén vacíos
    if (!data.nombre || !data.email || !data.contrasena || !data.direccion || !data.telefono) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

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
                text: errorData.message || 'Error al registrar el usuario.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
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
