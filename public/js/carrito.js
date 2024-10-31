document.addEventListener('DOMContentLoaded', () => {
    // Definir variables y obtener elementos del DOM
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPrecioElemento = document.getElementById('total-precio');
    const totalCantidadElemento = document.getElementById('total-cantidad');

    // Inicializar la página actual
    function init() {
        if (window.location.pathname.includes('cart.html')) {
            mostrarCarrito();
            document.getElementById('boton-comprar').addEventListener('click', manejarCompra);
        } else if (window.location.pathname.includes('product.html')) {
            cargarProductoYAgregarAlCarrito();
        }
        
        configurarModalPagos();
    }

    // Función para mostrar los productos del carrito en `cart.html`
    function mostrarCarrito() {
        listaCarrito.innerHTML = '';
        let totalCantidad = 0;
        let totalPrecio = 0;

        console.log('Carrito:', carrito); // Verificar contenido del carrito

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>No hay productos en el carrito.</p>';
            actualizarTotales(totalPrecio, totalCantidad);
            return;
        }

        carrito.forEach(producto => {
            totalCantidad += producto.cantidad;
            totalPrecio += producto.precio * producto.cantidad; // Calcular el total
            agregarProductoAlCarrito(producto);
        });

        console.log(`Total cantidad: ${totalCantidad}`);
        console.log(`Total precio: ₲${totalPrecio.toLocaleString('es-PY')}`);

        actualizarTotales(totalPrecio, totalCantidad); // Actualiza los totales en el DOM
    }

    // Función para actualizar los totales en el carrito
    function actualizarTotales(totalPrecio, totalCantidad) {
        totalPrecioElemento.textContent = `₲${Number(totalPrecio).toLocaleString('es-PY')}`; // Formatear el precio
        totalCantidadElemento.textContent = totalCantidad; // Actualizar cantidad total
    }

    // Función para agregar un producto al DOM
    function agregarProductoAlCarrito(producto) {
        const item = document.createElement('div');
        item.classList.add('carrito-item');
        item.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${producto.foto_url || 'image/no_image.png'}" class="img-thumbnail" width="100" alt="${producto.nombre}">
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
    }

    // Función para agregar productos al carrito
    function agregarAlCarrito(producto, cantidad) {
        if (isNaN(cantidad) || cantidad <= 0) {
            mostrarNotificacion('Cantidad inválida. Debe ser un número positivo.');
            return;
        }

        const index = carrito.findIndex(item => item.id === producto.id);
        if (index >= 0) {
            carrito[index].cantidad += cantidad; // Aumenta la cantidad si ya existe
        } else {
            producto.cantidad = cantidad; // Establece la cantidad al agregar
            carrito.push(producto); // Agrega el nuevo producto al carrito
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarNotificacion(`Se agregó ${producto.nombre} al carrito.`);
        mostrarCarrito();
    }

    // Función para cargar el producto actual desde `product.html`
    function cargarProductoYAgregarAlCarrito() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (productId) {
            fetch(`http://127.0.0.1:3000/api/productos/${productId}`)
 .then(response => response.json())
                .then(producto => {
                    if (producto) {
                        document.getElementById('button-cart').addEventListener('click', () => {
                            const cantidad = parseInt(document.getElementById('input-quantity').value, 10);
                            if (isNaN(cantidad) || cantidad <= 0) {
                                mostrarNotificacion('Cantidad inválida. Debe ser un número positivo.');
                                return;
                            }
                            agregarAlCarrito({
                                id: producto.id,
                                nombre: producto.nombre,
                                precio: producto.precio,
                                foto_url: producto.foto_url || 'image/no_image.png', // Asegúrate de que el campo de la imagen se llame `foto_url`
                                cantidad: cantidad // Asegúrate de que la cantidad se esté pasando aquí
                            }, cantidad);
                        });
                    }
                })
                .catch(err => console.error('Error al cargar el producto:', err));
        }
    }

    // Función para manejar la compra en `cart.html`
    function manejarCompra() {
        if (carrito.length === 0) {
            mostrarNotificacion('El carrito está vacío');
            return;
        }

        // Simulación de compra
        mostrarNotificacion('Compra realizada con éxito.');
        carrito = []; // Vaciar el carrito después de la compra
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito(); // Actualizar visualmente el carrito
    }

    // Configuración del modal de métodos de pago
    function configurarModalPagos() {
        document.getElementById('metodo-pago-texto').addEventListener('click', () => {
            $('#buyModal').modal('show'); // Mostrar el modal de Bootstrap
        });

        // Selección del método de pago en el modal
        document.getElementById('payWithCard').addEventListener('click', () => mostrarFormularioPago('cardForm'));
        document.getElementById('payWithEfectivo').addEventListener('click', () => mostrarFormularioPago('efectivoForm'));
        document.getElementById('payWithTransferencia').addEventListener('click', () => mostrarFormularioPago('transferenciaForm'));

        // Confirmar el pago
        document.getElementById('confirmTarjeta').addEventListener('click', () => procesarPago('Tarjeta'));
        document.getElementById('confirmEfectivo').addEventListener('click', () => procesarPago('Efectivo'));
        document.getElementById('confirmTransferencia').addEventListener('click', () => procesarPago('Transferencia'));
    }

    // Función para mostrar el formulario de método de pago correspondiente
    function mostrarFormularioPago(formularioId) {
        document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));
        document.getElementById(formularioId).classList.add('active');
    }

    // Función para simular el procesamiento del pago
    function procesarPago(metodo) {
        mostrarNotificacion(`Pago con ${metodo} procesado exitosamente!`);
        carrito = []; // Vaciar el carrito después de la compra
        localStorage.setItem('carrito', JSON.stringify(carrito));
        $('#buyModal').modal('hide'); // Cerrar el modal
        mostrarCarrito(); // Actualizar visualmente el carrito
    }

    // Función para mostrar notificaciones al usuario
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.classList.add('alert', 'alert-info');
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        setTimeout(() => {
            notificacion.remove();
        }, 3000); // La notificación se elimina después de 3 segundos
    }

    // Ejecutar la inicialización
    init();
});