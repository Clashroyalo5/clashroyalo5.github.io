// --- Lógica de ePayco (Checkout) ---

// ***************************************************************
// ¡¡IMPORTANTE!! DEBES PONER TUS LLAVES DE PRUEBA AQUÍ
// Las obtienes de tu Dashboard ePayco > Integraciones > Llaves API
const EPAYCO_P_KEY = 'TU_P_KEY_AQUI'; // Llave P_KEY
const EPAYCO_CUST_ID = 'TU_P_CUST_ID_AQUI'; // Llave P_CUST_ID_CLIENTE
// ***************************************************************

// 1. Configurar el handler de ePayco
var handler = ePayco.checkout.create({
    key: EPAYCO_P_KEY,
    test: true // ¡¡IMPORTANTE!! Poner en 'false' cuando vayas a producción
});

// 2. Esperar a que el DOM de pago.html esté listo
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del formulario
    const formulario = document.getElementById('formulario-cliente');
    if (!formulario) return; // Salir si no estamos en pago.html

    const btnPagar = document.getElementById('btn-pagar-epayco');
    const checkTerminos = document.getElementById('check-terminos');
    
    const inputNombre = document.getElementById('nombre-pago');
    const inputEmail = document.getElementById('email-pago');
    const inputTel = document.getElementById('tel-pago');

    // 3. Función para validar el formulario
    // Esto soluciona tu problema del "botón bloqueado"
    function validarFormulario() {
        const nombreValido = inputNombre.value.trim().length > 3;
        const emailValido = inputEmail.value.trim().includes('@');
        const telValido = inputTel.value.trim().length >= 7;
        const terminosAceptados = checkTerminos.checked;

        if (nombreValido && emailValido && telValido && terminosAceptados) {
            btnPagar.disabled = false;
        } else {
            btnPagar.disabled = true;
        }
    }

    // 4. Añadir listeners para validar en tiempo real
    inputNombre.addEventListener('input', validarFormulario);
    inputEmail.addEventListener('input', validarFormulario);
    inputTel.addEventListener('input', validarFormulario);
    checkTerminos.addEventListener('change', validarFormulario);

    // 5. Manejar el clic en "Pagar"
    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evitar que el formulario se envíe
        
        // Obtener el total y los productos
        const total = document.getElementById('total-a-pagar').value;
        const carrito = getCarrito(); // Función de carrito.js
        
        // Crear descripción
        const descripcion = carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');

        // Guardar datos del cliente en sessionStorage para usarlos en 'confirmado.html'
        sessionStorage.setItem('clienteNombre', inputNombre.value);
        sessionStorage.setItem('clienteEmail', inputEmail.value);
        sessionStorage.setItem('clienteTel', inputTel.value);
        sessionStorage.setItem('clienteSpecs', document.getElementById('specs-pago').value);
        sessionStorage.setItem('pedidoCarrito', JSON.stringify(carrito));
        sessionStorage.setItem('pedidoTotal', total);

        // 6. Abrir el Pop-up de ePayco
        handler.open({
            // Información de la compra
            amount: total,
            tax: 0,
            tax_base: total,
            name: 'Pedido Kaleidocospio',
            description: descripcion,
            currency: 'cop',

            // Información del cliente
            country: 'CO',
            lang: 'es',
            invoice: 'INV-' + Math.floor(Math.random() * 10000), // Factura aleatoria
            
            // Datos del formulario
            "extra1": inputNombre.value,
            "extra2": inputEmail.value,
            "extra3": inputTel.value,
            
            // Configuración de la respuesta
            external: 'false', // Usar el modal pop-up
            
            // ¡¡IMPORTANTE!! Esta debe ser la URL de tu sitio subido
            response: 'https://tu-dominio.com/verificacion.html',
            confirmation: 'https://tu-dominio.com/confirmacion-epayco.html', // (Opcional, manejo de servidor)
            
            // Datos pre-llenados (opcional)
            name_billing: inputNombre.value,
            email_billing: inputEmail.value,
            mobilephone_billing: inputTel.value,
            
            // Tus llaves de negocio
            p_cust_id_cliente: EPAYCO_CUST_ID,
            p_key: EPAYCO_P_KEY
        });
    });
});