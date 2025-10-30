// --- Funciones de Lógica del Carrito (localStorage) ---

const CARRITO_KEY = 'kaleidocospio_carrito';

// Obtiene el carrito desde localStorage
function getCarrito() {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
}

// Guarda el carrito en localStorage
function saveCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

// Calcula el total del carrito
function calcularTotalCarrito() {
    const carrito = getCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// (Llamada desde index.html)
function agregarItemAlCarrito(id, nombre, precio, cantidad) {
    const carrito = getCarrito();
    
    // Buscar si el item ya existe
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        // Si existe, actualiza la cantidad
        itemExistente.cantidad += cantidad;
    } else {
        // Si no existe, lo agrega
        const newItem = { id, nombre, precio, cantidad };
        carrito.push(newItem);
    }
    
    saveCarrito(carrito);
}

// (Llamada desde carrito.html)
function renderizarPaginaCarrito() {
    const carrito = getCarrito();
    const listaCarritoDiv = document.getElementById('lista-carrito');
    const resumenTotalDiv = document.getElementById('resumen-total');
    
    if (carrito.length === 0) {
        listaCarritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
        resumenTotalDiv.innerHTML = '<h3>Total: $0</h3>';
        // Deshabilitar botón de pago si está vacío
        const btnPagar = document.querySelector('a[href="pago.html"]');
        if (btnPagar) {
            btnPagar.style.pointerEvents = 'none';
            btnPagar.style.backgroundColor = '#aaa';
        }
        return;
    }

    let html = '';
    carrito.forEach(item => {
        html += `
            <div class="item-carrito" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>Cant: ${item.cantidad} x $${item.precio.toLocaleString('es-CO')}</small>
                </div>
                <div>
                    <strong>$${(item.cantidad * item.precio).toLocaleString('es-CO')}</strong>
                    <button onclick="removerItemDelCarrito('${item.id}')" style="background: red; color: white; border: none; padding: 5px; cursor: pointer; margin-left: 10px;">X</button>
                </div>
            </div>
        `;
    });
    
    listaCarritoDiv.innerHTML = html;
    
    const total = calcularTotalCarrito();
    resumenTotalDiv.innerHTML = `<h3>Total: $${total.toLocaleString('es-CO')}</h3>`;
}

// (Llamada desde carrito.html)
function removerItemDelCarrito(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.id !== id);
    saveCarrito(carrito);
    // Volver a renderizar la vista del carrito
    renderizarPaginaCarrito();
}

// (Llamada desde pago.html)
// Esto soluciona tu problema de "xx.xxx"
function renderizarResumenPago() {
    const total = calcularTotalCarrito();
    const resumenPagoDiv = document.getElementById('resumen-pago');
    
    if (resumenPagoDiv) {
        resumenPagoDiv.innerHTML = `
            <p>Total a Pagar: <strong>$${total.toLocaleString('es-CO')}</strong></p>
            <input type="hidden" id="total-a-pagar" value="${total}">
        `;
    }
}

// Asegurarnos de que el script corra en la página correcta
if (document.getElementById('lista-carrito')) {
    document.addEventListener('DOMContentLoaded', renderizarPaginaCarrito);
}
if (document.getElementById('resumen-pago')) {
    document.addEventListener('DOMContentLoaded', renderizarResumenPago);
}