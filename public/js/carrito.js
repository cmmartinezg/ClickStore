document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPrecioElemento = document.getElementById('total-precio');
    const totalCantidadElemento = document.getElementById('total-cantidad');

    // Inicializar el carrito al cargar la página
    mostrarCarrito();

    // Función para agregar productos al carrito
    function agregarAlCarrito(producto, cantidad) {
        const index = carrito.findIndex(item => item.id === producto.id);
        if (index >= 0) {
            carrito[index].cantidad += cantidad;
        } else {
            producto.cantidad = cantidad;
            carrito.push(producto);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`Se agregó ${producto.nombre} al carrito.`);
        mostrarCarrito();
    }

    // Función para mostrar el carrito en la página `cart.html`
    function mostrarCarrito() {
        listaCarrito.innerHTML = '';
        let totalCantidad = 0;
        let totalPrecio = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>No hay productos en el carrito.</p>';
            totalPrecioElemento.textContent = '₲0';
            totalCantidadElemento.textContent = '0';
            return;
        }

        carrito.forEach(producto => {
            totalCantidad += producto.cantidad;
            totalPrecio += producto.precio * producto.cantidad;

            const item = document.createElement('div');
            item.classList.add('carrito-item');
            item.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${producto.imagen || 'image/no_image.png'}" class="img-thumbnail" width="100">
                    </div>
                    <div class="col-md-6">
                        <h5>${producto.nombre}</h5>
                        <p>Precio: ₲${Number(producto.precio).toLocaleString('es-PY')}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-danger btn-sm eliminar-item">Eliminar</button>
                    </div>
                </div>
                <hr>
            `;
            listaCarrito.appendChild(item);

            // Evento para eliminar el producto
            item.querySelector('.eliminar-item').addEventListener('click', () => {
                carrito = carrito.filter(p => p.id !== producto.id);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito(); // Actualizar el carrito después de eliminar
            });
        });

        // Actualizar los totales
        totalPrecioElemento.textContent = `₲${Number(totalPrecio).toLocaleString('es-PY')}`;
        totalCantidadElemento.textContent = totalCantidad;
    }

    // Función para cargar y agregar el producto al carrito desde `product.html`
    function cargarProductoYAgregarAlCarrito() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (productId) {
            fetch(`http://localhost:3000/api/productos/${productId}`)
                .then(response => response.json())
                .then(producto => {
                    document.getElementById('button-cart').addEventListener('click', () => {
                        const cantidad = parseInt(document.getElementById('input-quantity').value, 10);
                        agregarAlCarrito(producto, cantidad);
                    });
                })
                .catch(err => console.error('Error al cargar el producto:', err));
        }
    }

    // Función para manejar la compra en `cart.html`
    function manejarCompra() {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        // Simulación de compra
        alert('Compra realizada con éxito.');
        carrito = []; // Vaciar el carrito después de la compra
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito(); // Actualizar visualmente el carrito
    }

    // Detectar la página actual y ejecutar la función correspondiente
    if (window.location.pathname.includes('cart.html')) {
        mostrarCarrito();
        document.getElementById('boton-comprar').addEventListener('click', manejarCompra);
    } else if (window.location.pathname.includes('product.html')) {
        cargarProductoYAgregarAlCarrito();
    }

    // Modal de Métodos de Pago
    document.getElementById('metodo-pago-texto').addEventListener('click', () => {
        $('#buyModal').modal('show'); // Mostrar el modal de Bootstrap
    });

    // Selección del método de pago en el modal
    document.getElementById('payWithCard').addEventListener('click', () => mostrarFormularioPago('cardForm'));
    document.getElementById('payWithEfectivo').addEventListener('click', () => mostrarFormularioPago('efectivoForm'));
    document.getElementById('payWithTransferencia').addEventListener('click', () => mostrarFormularioPago('transferenciaForm'));

    // Función para mostrar el formulario de método de pago correspondiente
    function mostrarFormularioPago(formularioId) {
        document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));
        document.getElementById(formularioId).classList.add('active');
    }

    // Confirmar el pago
    document.getElementById('confirmTarjeta').addEventListener('click', () => procesarPago('Tarjeta'));
    document.getElementById('confirmEfectivo').addEventListener('click', () => procesarPago('Efectivo'));
    document.getElementById('confirmTransferencia').addEventListener('click', () => procesarPago('Transferencia'));

    // Función para simular el procesamiento del pago
    function procesarPago(metodo) {
        alert(`Pago con ${metodo} procesado exitosamente!`);
        carrito = []; // Vaciar el carrito después de la compra
        localStorage.setItem('carrito', JSON.stringify(carrito));
        $('#buyModal').modal('hide'); // Cerrar el modal
        mostrarCarrito(); // Actualizar visualmente el carrito
    }
});
