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
                    <p>Capacidad: ${producto.capacidad}</p>
                    <p>Precio: $${producto.precio.toFixed(2)}</p> <!-- Mostrar precio -->
                    <p>Cantidad: ${producto.cantidad}</p>
                    <button onclick="verDetalles('${producto.nombre}', '${producto.capacidad}', '${producto.imagen}')">Ver Detalles</button>
                    <button onclick="editarProducto('${producto.id}')">Editar</button>
                    <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                `;
                productList.appendChild(productCard);
            });
            
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}
// Función para editar un producto (con formulario de edición)
function editarProducto(id) {
    fetch(`/inventario/${id}`)
        .then(response => response.json())
        .then(producto => {
            // Mostrar el formulario con los datos del producto cargados
            document.getElementById('nombreProducto').value = producto.nombre;
            document.getElementById('capacidadProducto').value = producto.capacidad;
            document.getElementById('descripcionProducto').value = producto.descripcion;
            document.getElementById('imagenProducto').value = producto.imagen;
            document.getElementById('categoriaProducto').value = producto.categoria;
            document.getElementById('cantidadProducto').value = producto.cantidad;
            document.getElementById('precioProducto').value = producto.precio;

            // Cambiar el texto del botón a "Guardar Cambios"
            const formButton = document.querySelector('#productoForm button');
            formButton.innerText = 'Guardar Cambios';

            // Cambiar el comportamiento del formulario para editar en lugar de agregar
            document.getElementById('productoForm').onsubmit = (e) => {
                e.preventDefault();

                const productoActualizado = {
                    nombre: document.getElementById('nombreProducto').value,
                    capacidad: document.getElementById('capacidadProducto').value,
                    descripcion: document.getElementById('descripcionProducto').value,
                    imagen: document.getElementById('imagenProducto').value,
                    categoria: document.getElementById('categoriaProducto').value,
                    cantidad: parseInt(document.getElementById('cantidadProducto').value),
                    precio: parseFloat(document.getElementById('precioProducto').value)
                };

                // Realizar la solicitud para actualizar el producto
                fetch(`/inventario/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoActualizado)
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.mensaje);
                    cargarProductos();  // Recargar la lista de productos
                    document.getElementById('productoForm').reset();  // Limpiar el formulario
                    document.getElementById('form-agregar-producto').style.display = 'none';  // Ocultar el formulario después de editar
                })
                .catch(error => console.error('Error al actualizar el producto:', error));
            };

            // Mostrar el formulario de edición
            document.getElementById('form-agregar-producto').style.display = 'block';
        })
        .catch(error => console.error('Error al cargar el producto:', error));
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
        cantidad: parseInt(document.getElementById('cantidadProducto').value), // Convertir cantidad a número
        precio: parseFloat(document.getElementById('precioProducto').value)  // Nuevo campo de precio
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
