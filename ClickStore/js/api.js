// js/api.js

// Función para obtener productos y mostrarlos en la lista
async function obtenerProductos() {
  try {
    const response = await fetch('http://localhost:3000/api/producto'); // Asegúrate de que la URL sea correcta
    const productos = await response.json();
    const lista = document.getElementById('productos-lista');
    lista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
    productos.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.nombre}: ${producto.descripcion} - ${producto.precio} Gs`;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

// Función para manejar el envío del formulario de registro de usuario
async function registrarUsuario(event) {
  event.preventDefault();

  const nombre_usuario = document.getElementById('input-usuario').value;
  const email = document.getElementById('input-email').value;
  const contraseña = document.getElementById('input-password').value;
  const direccion = document.getElementById('input-direccion').value;
  const telefono = document.getElementById('input-telefono').value;

  const data = {
    nombre: nombre_usuario,
    email: email,
    contraseña: contraseña,
    direccion: direccion,
    telefono: telefono
  };

  try {
    const response = await fetch('http://localhost:3000/api/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      alert('Usuario registrado exitosamente');
      window.location.href = 'index.html'; // Redirigir al index
    } else {
      alert('Error al registrar el usuario');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al registrar el usuario');
  }
}

// Añadir eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  obtenerProductos();
  
  const form = document.querySelector('form#form-registro');
  if (form) {
    form.addEventListener('submit', registrarUsuario);
  }
});
