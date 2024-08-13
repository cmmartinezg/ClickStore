// js/api.js

// Función para manejar el envío del formulario de inicio de sesión
async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.querySelector('#login-email').value;
    const contraseña = document.querySelector('#login-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, contraseña })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('tipoUsuario', data.tipo);
            alert(data.mensaje);
            // Redirigir según el tipo de usuario
            if (data.tipo === 'comerciante') {
                window.location.href = 'index.html?mensaje=Comerciante autenticado exitosamente';
            } else {
                window.location.href = 'index.html?mensaje=Usuario autenticado exitosamente';
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
}

// Añadir eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('form#form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }
});
