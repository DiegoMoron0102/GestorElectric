// Función para abrir una nueva ventana con los detalles del producto
function verDetalles(nombre, capacidad, imagen) {
    // Crea una nueva ventana con los parámetros del producto en la URL
    const url = `detallesProducto.html?nombre=${encodeURIComponent(nombre)}&capacidad=${encodeURIComponent(capacidad)}&imagen=${encodeURIComponent(imagen)}`;
    window.open(url, '_blank');
}

// Ejemplo de uso para un botón de detalles
document.addEventListener('DOMContentLoaded', function() {
    // Encuentra todos los botones de "Ver detalles"
    const botonesDetalles = document.querySelectorAll('.btn-detalles');
    
    botonesDetalles.forEach((boton) => {
        boton.addEventListener('click', function() {
            // Obtener los datos del producto del botón o de los atributos de la fila
            const nombre = this.dataset.nombre;
            const capacidad = this.dataset.capacidad;
            const imagen = this.dataset.imagen;
            
            // Llamar a la función verDetalles con los datos del producto
            verDetalles(nombre, capacidad, imagen);
        });
    });
});
