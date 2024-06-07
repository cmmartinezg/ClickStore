// js/api.js

// Función para manejar el envío del formulario de registro de comerciante
async function registrarComerciante(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('http://localhost:3000/api/comerciante', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            sessionStorage.setItem('tipoUsuario', 'comerciante');
            window.location.href = 'index.html?mensaje=Comerciante registrado exitosamente';
        } else {
            const errorData = await response.json();
            console.error('Error al registrar comerciante:', errorData);
            alert('Hubo un error al registrar el comerciante. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
}

// Añadir eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const formComerciante = document.querySelector('form#registroComercianteForm');
    if (formComerciante) {
        formComerciante.addEventListener('submit', registrarComerciante);
    }
});
