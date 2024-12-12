// js/carrito.js

// Función para añadir un producto al carrito
async function añadirAlCarrito(productoId, cantidad) {
    const usuarioId = sessionStorage.getItem('id');
    const nombreUsuario = sessionStorage.getItem('nombre');

    // Validar si el usuario está autenticado
    if (!usuarioId) {
        alert('Por favor, inicia sesión para añadir productos al carrito.');
        return;
    }

    const data = {
        id_usuario: parseInt(usuarioId),
        id_producto: productoId,
        cantidad: cantidad,
        usuario: nombreUsuario,
        producto: document.getElementById('product-name').textContent
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/api/carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Producto añadido al carrito con éxito.');
            actualizarContadorCarrito();
        } else {
            const errorData = await response.json();
            alert(`Error al añadir al carrito: ${errorData.message || 'Intente nuevamente.'}`);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al conectar con el servidor. Inténtalo de nuevo.');
    }
}

// Función para mostrar los productos del carrito en la página `cart.html`
async function mostrarCarrito() {
    const usuarioId = sessionStorage.getItem('id');

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/carrito/${usuarioId}`);
        const carrito = await response.json();

        const listaCarrito = document.getElementById('lista-carrito');
        if (carrito.length > 0) {
            listaCarrito.innerHTML = '';
            let totalCantidad = 0;
            let totalPrecio = 0;

            carrito.forEach(producto => {
                const item = document.createElement('div');
                item.innerHTML = `
                    <div class="row carrito-item">
                        <div class="col-md-4">
                            <img src="${producto.foto_url || 'image/no_image.png'}" class="img-thumbnail" width="100">
                        </div>
                        <div class="col-md-6">
                            <h5>${producto.producto}</h5>
                            <p>Precio: ₲${Number(producto.precio).toLocaleString('es-PY')}</p>
                            <p>Cantidad: ${producto.cantidad}</p>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-danger btn-sm eliminar-item" data-id="${producto.id}">Eliminar</button>
                        </div>
                    </div>
                    <hr>
                `;
                listaCarrito.appendChild(item);

                totalCantidad += producto.cantidad;
                totalPrecio += producto.precio * producto.cantidad;

                // Agregar evento para eliminar producto
                item.querySelector('.eliminar-item').addEventListener('click', () => {
                    eliminarProductoDelCarrito(producto.id);
                });
            });

            document.getElementById('total-precio').textContent = `₲${totalPrecio.toLocaleString('es-PY')}`;
            document.getElementById('total-cantidad').textContent = totalCantidad;
        } else {
            listaCarrito.innerHTML = '<p>No hay productos en el carrito.</p>';
            document.getElementById('total-precio').textContent = '₲0';
            document.getElementById('total-cantidad').textContent = '0';
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
}

// Función para eliminar un producto del carrito
async function eliminarProductoDelCarrito(carritoId) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/carrito/${carritoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado del carrito con éxito.');
            mostrarCarrito(); // Actualizar la lista de productos
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar el producto: ${errorData.message || 'Intente nuevamente.'}`);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al conectar con el servidor. Inténtalo de nuevo.');
    }
}

// Función para actualizar el contador de productos en el carrito
async function actualizarContadorCarrito() {
    const usuarioId = sessionStorage.getItem('id');
    if (!usuarioId) return;

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/carrito/count/${usuarioId}`);
        const data = await response.json();
        document.getElementById('cart-count').textContent = data.total || 0;
    } catch (error) {
        console.error('Error al actualizar el contador del carrito:', error);
    }
}

// Función para finalizar la compra
async function finalizarCompra() {
    const usuarioId = sessionStorage.getItem('id');
    if (!usuarioId) return;

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/compras/${usuarioId}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Compra finalizada con éxito.');
            mostrarCarrito(); // Actualizar el carrito después de la compra
        } else {
            const errorData = await response.json();
            alert(`Error al finalizar la compra: ${errorData.message || 'Intente nuevamente.'}`);
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
    }
}

// Exportar las funciones globalmente para usarlas en el frontend
window.añadirAlCarrito = añadirAlCarrito;
window.mostrarCarrito = mostrarCarrito;
window.eliminarProductoDelCarrito = eliminarProductoDelCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;
window.finalizarCompra = finalizarCompra;

// Inicializar el carrito en `cart.html`
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('cart.html')) {
        mostrarCarrito(); // Mostrar los productos del carrito si estamos en la página correspondiente
    }
});
