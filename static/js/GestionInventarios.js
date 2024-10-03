document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Cargar productos cuando la página cargue

    // Mostrar y ocultar el formulario
    const mostrarFormBtn = document.getElementById('mostrar-form-btn');
    const formAgregarProducto = document.getElementById('form-agregar-producto');

    mostrarFormBtn.addEventListener('click', () => {
        if (formAgregarProducto.style.display === 'none') {
            formAgregarProducto.style.display = 'block';  // Mostrar el formulario
        } else {
            formAgregarProducto.style.display = 'none';  // Ocultar el formulario
        }
    });
});

// Función para cargar productos desde el backend
function cargarProductos() {
    fetch('/inventario')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Limpiar la lista de productos

            data.forEach(producto => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.capacidad}</p>
                    <button onclick="verDetalles('${producto.nombre}', '${producto.capacidad}', '${producto.imagen}')">Ver Detalles</button>
                    <button onclick="editarProducto('${producto.id}')">Editar</button>
                    <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para agregar un nuevo producto
document.getElementById('productoForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoProducto = {
        nombre: document.getElementById('nombreProducto').value,
        capacidad: document.getElementById('capacidadProducto').value,
        descripcion: document.getElementById('descripcionProducto').value,
        imagen: document.getElementById('imagenProducto').value,
        categoria: document.getElementById('categoriaProducto').value,
        cantidad: document.getElementById('cantidadProducto').value
    };

    fetch('/inventario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarProductos(); // Recargar la lista de productos
        document.getElementById('productoForm').reset();  // Limpiar el formulario
        document.getElementById('form-agregar-producto').style.display = 'none';  // Ocultar el formulario después de agregar
    })
    .catch(error => console.error('Error al agregar el producto:', error));
});

// Función para eliminar un producto
function eliminarProducto(id) {
    fetch(`/inventario/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarProductos(); // Recargar la lista de productos
    })
    .catch(error => console.error('Error al eliminar el producto:', error));
}

// Función para editar un producto (requiere ajustes adicionales para un formulario de edición)
function editarProducto(id) {
    // Aquí puedes implementar la lógica para editar el producto
    alert('Función de edición por implementar.');
}
