document.addEventListener('DOMContentLoaded', () => {

    const categoriasItems = document.querySelectorAll('.categoria-item');
    const productosDisplay = document.getElementById('productos-display');

    // --- LÓGICA DE RENDERIZADO DE PRODUCTOS ---
    const renderizarProductos = (categoriaId) => {
        const productos = DATOS_PRODUCTOS[categoriaId];
        
        if (!productos || productos.length === 0) {
            productosDisplay.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }

        let html = '<div class="listado-productos">';

        productos.forEach(producto => {
            html += `
                <div class="card-producto">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="card-producto-info">
                        <h4>${producto.nombre}</h4>
                        <span class="precio">$${producto.precio.toLocaleString('es-CO')}</span>
                        
                        <div class="card-producto-controles">
                            <input type="number" id="cantidad-${producto.id}" value="1" min="1" class="form-control">
                            <button 
                                class="btn btn-secundario" 
                                onclick="manejarAgregarAlCarrito('${producto.id}', '${producto.nombre}', ${producto.precio})">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        productosDisplay.innerHTML = html;
    };

    // --- LÓGICA DEL ACORDEÓN (BOLAS) ---
    categoriasItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetCategoria = item.dataset.target;
            categoriasItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderizarProductos(targetCategoria);
        });
    });

    // Cargar la primera categoría por defecto
    if (categoriasItems.length > 0) {
        categoriasItems[0].click();
    }
});

// --- FUNCIÓN GLOBAL PARA EL CARRITO ---
// Esta función ahora SÍ llama a carrito.js
function manejarAgregarAlCarrito(id, nombre, precio) {
    const cantidadInput = document.getElementById(`cantidad-${id}`);
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad > 0) {
        // Llama a la función de carrito.js
        agregarItemAlCarrito(id, nombre, precio, cantidad);
        
        // Damos feedback al usuario
        alert(`¡Agregaste ${cantidad} x ${nombre} al carrito!`);
        
        // Opcional: actualizar un contador en el header
        // actualizarContadorCarrito(); 
    }
}