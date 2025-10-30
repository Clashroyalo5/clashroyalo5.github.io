// --- Lógica de 'confirmado.html' (Envío a Formspree) ---

// ***************************************************************
// ¡¡IMPORTANTE!! DEBES PONER TU ID DE FORMULARIO DE FORMSPREE
// Lo obtienes de Formspree (ej: https://formspree.io/f/mnqwe123)
const FORMSPREE_URL = 'https://formspree.io/f/TU_ID_DE_FORMULARIO';
// ***************************************************************


document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los datos guardados de sessionStorage
    const nombre = sessionStorage.getItem('clienteNombre');
    const email = sessionStorage.getItem('clienteEmail');
    const tel = sessionStorage.getItem('clienteTel');
    const specs = sessionStorage.getItem('clienteSpecs');
    const refPago = sessionStorage.getItem('ref_payco');
    const carrito = JSON.parse(sessionStorage.getItem('pedidoCarrito'));
    const total = sessionStorage.getItem('pedidoTotal');

    // 2. Poner los datos en la página de "Gracias"
    document.getElementById('nombre-cliente').textContent = nombre || 'Cliente';
    document.getElementById('contacto-cliente').textContent = tel || email || 'tu correo';
    document.getElementById('ref-pago').textContent = `#${refPago || 'N/A'}`;

    // 3. Función para enviar los datos a Formspree (al negocio)
    async function enviarNotificacionAlNegocio() {
        
        // 3.1. Construir el mensaje del pedido
        let productosTexto = '';
        if (carrito && carrito.length > 0) {
            carrito.forEach(item => {
                productosTexto += `- ${item.cantidad}x ${item.nombre} ($${(item.precio * item.cantidad).toLocaleString('es-CO')})\n`;
            });
        }

        const mensaje = `
            --- NUEVO PEDIDO CONFIRMADO ---

            Referencia de Pago: ${refPago}
            Total Pagado: $${parseInt(total).toLocaleString('es-CO')}
            
            --- Datos del Cliente ---
            Nombre: ${nombre}
            Email: ${email}
            Teléfono: ${tel}
            
            --- Detalles del Pedido ---
            Especificaciones: 
            ${specs || 'Sin especificaciones.'}
            
            Productos:
            ${productosTexto}
        `;

        // 3.2. Crear el FormData para Formspree
        const formData = new FormData();
        formData.append('subject', `Nuevo Pedido Kaleidocospio - Ref #${refPago}`);
        formData.append('Nombre', nombre);
        formData.append('Email', email);
        formData.append('Telefono', tel);
        formData.append('Referencia_ePayco', refPago);
        formData.append('Total', total);
        formData.append('Pedido_Completo', mensaje);

        // 3.3. Enviar el POST a Formspree
        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Notificación enviada exitosamente a Formspree.');
            } else {
                console.error('Error enviando notificación a Formspree.');
            }

        } catch (error) {
            console.error('Error de red al contactar Formspree:', error);
        }

        // 4. Limpiar el sessionStorage y el localStorage (pedido completado)
        sessionStorage.clear();
        localStorage.removeItem(CARRITO_KEY); // Limpia el carrito
    }

    // 5. Ejecutar el envío (solo si hay datos)
    if (nombre && refPago) {
        enviarNotificacionAlNegocio();
    } else {
        console.warn('No hay datos de sesión para enviar. El usuario quizás recargó la página.');
        // No limpiar la sesión para que el usuario pueda ver sus datos
    }
});