function cargarProductosCategoria(categoria) {
    // Simulación de productos para cada categoría
    const productos = [
        { nombre: "Ordenador Gamer", categoria: "Electrónica", precio: "₲3.500.000" },
        { nombre: "Auriculares", categoria: "Electrónica", precio: "₲250.000" },
        { nombre: "Vestido de Verano", categoria: "Ropa", precio: "₲200.000" },
        // Agregar más productos...
    ];

    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    
    const listaProductos = document.getElementById('productos-lista');
    listaProductos.innerHTML = ''; // Limpiar la lista de productos

    productosFiltrados.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'producto-item';
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.precio}</p>
        `;
        listaProductos.appendChild(item);
    });
}

function performSearch() {
    const select = document.querySelector('.search-bar select');
    const categoria = select.value;
    const searchTerm = document.getElementById('filter_name').value.toLowerCase();

    window.location.href = `${categoria.toLowerCase()}.html?search=${encodeURIComponent(searchTerm)}`;
}

function filterProductos() {
    const searchTerm = document.getElementById('filter_name').value.toLowerCase();
    const items = document.querySelectorAll('.producto-item');

    items.forEach(item => {
        const nombre = item.querySelector('h3').textContent.toLowerCase();
        if (nombre.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
