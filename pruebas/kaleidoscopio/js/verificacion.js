// --- Lógica de Verificación (Página Intermedia) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Leer los parámetros de la URL que ePayco nos envía
    const params = new URLSearchParams(window.location.search);
    const ref_payco = params.get('ref_payco');

    // 2. Verificación SIMPLE (Estática):
    // Si ePayco nos envía una 'ref_payco', asumimos que el pago fue
    // procesado (ya sea Aprobado, Pendiente o Rechazado).
    // La lógica avanzada requeriría un backend para consultar el estado.
    // Para un sitio estático, confiamos en que si hay ref, continuamos.

    if (ref_payco) {
        // 3. Guardamos la referencia para mostrarla en la página de gracias
        sessionStorage.setItem('ref_payco', ref_payco);
        
        // 4. Redirigimos a la página de confirmación
        console.log('Referencia de pago recibida:', ref_payco, '. Redirigiendo a confirmado...');
        window.location.href = 'confirmado.html';
        
    } else {
        // 5. Si no hay ref_payco, algo salió mal (ej: el usuario cerró el pop-up)
        console.log('No se recibió ref_payco. Redirigiendo a pago...');
        // Opcional: puedes crear una página 'pago-fallido.html'
        alert('El pago fue cancelado o no se pudo procesar.');
        window.location.href = 'pago.html';
    }
});