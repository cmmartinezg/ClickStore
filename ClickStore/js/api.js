// js/api.js

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
  
  document.addEventListener('DOMContentLoaded', () => {
    obtenerProductos();
  });
  