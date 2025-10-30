// Base de datos de productos de Kaleidocospio
// Las imágenes son placeholders de placehold.co. 
// Debes reemplazarlas por las tuyas en /assets/imgs/
const DATOS_PRODUCTOS = {
    // El ID de categoría (ej: 'camisetas') debe coincidir con el data-target del HTML
    'camisetas': [
        {
            id: 'cam-001',
            nombre: 'Camiseta Estampado Personalizado',
            precio: 35000,
            imagen: 'https://placehold.co/300x300/00B8A9/white?text=Camiseta'
        },
        {
            id: 'cam-002',
            nombre: 'Camiseta tipo Polo Bordada',
            precio: 45000,
            imagen: 'https://placehold.co/300x300/005A9C/white?text=Polo'
        }
    ],
    'tazas': [
        {
            id: 'taza-001',
            nombre: 'Mug Mágico 11oz',
            precio: 25000,
            imagen: 'https://placehold.co/300x300/FF6B6B/white?text=Mug'
        },
        {
            id: 'taza-002',
            nombre: 'Mug Blanco Clásico 11oz',
            precio: 18000,
            imagen: 'https://placehold.co/300x300/EEEEEE/black?text=Mug'
        }
    ],
    'trofeos': [
        {
            id: 'tro-001',
            nombre: 'Trofeo Acrílico Corte Láser',
            precio: 80000,
            imagen: 'https://placehold.co/300x300/F9C80E/white?text=Trofeo'
        },
        {
            id: 'tro-002',
            nombre: 'Placa Conmemorativa',
            precio: 65000,
            imagen: 'https://placehold.co/300x300/D0D0D0/black?text=Placa'
        }
    ],
    'gorras': [
        {
            id: 'gor-001',
            nombre: 'Gorra Trucker Estampada',
            precio: 28000,
            imagen: 'https://placehold.co/300x300/333333/white?text=Gorra'
        }
    ],
    'llaveros': [
        {
            id: 'lla-001',
            nombre: 'Llavero Acrílico Personalizado',
            precio: 8000,
            imagen: 'https://placehold.co/300x300/8A2BE2/white?text=Llavero'
        }
    ],
    'botones': [
        {
            id: 'bot-001',
            nombre: 'Botón Publicitario 5.5cm',
            precio: 2000,
            imagen: 'https://placehold.co/300x300/FF9A00/white?text=Botón'
        }
    ],
    'otros': [
        {
            id: 'otr-001',
            nombre: 'Servicio de Diseño Gráfico',
            precio: 100000,
            imagen: 'https://placehold.co/300x300/B2B2B2/white?text=Diseño'
        }
    ]
};