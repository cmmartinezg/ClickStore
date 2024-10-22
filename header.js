// Actualiza los contadores de lista de deseos y carrito en el header
function actualizarContadores() {
    const wishlistCount = document.getElementById('wishlist-count');
    const cartCount = document.getElementById('cart-count');

    const favoritos = JSON.parse(localStorage.getItem('wishlist')) || [];
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    wishlistCount.textContent = favoritos.length;
    cartCount.textContent = carrito.length;
}

// Actualiza los contadores cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadores();
});

// Escucha cambios en el localStorage y actualiza los contadores si cambian en otra página
window.addEventListener('storage', () => {
    actualizarContadores();
});
