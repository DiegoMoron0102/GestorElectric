document.addEventListener("DOMContentLoaded", () => {
    cargarSoftware();  // Cargar la lista de software al cargar la página

    const addSoftwareBtn = document.getElementById("add-software-btn");
    const softwareForm = document.getElementById("software-form");
    const softwareFormElement = document.getElementById("softwareForm");
    const cancelarBtn = document.getElementById("cancelar-btn");

    let editando = false;
    let softwareId = null;  // Para el caso de edición

    // Mostrar el formulario al hacer clic en "Añadir Nuevo Software"
    addSoftwareBtn.addEventListener("click", () => {
        softwareForm.style.display = "block";
        limpiarFormulario();
        editando = false;  // Establecer en modo de creación
    });

    // Cancelar la acción del formulario
    cancelarBtn.addEventListener("click", () => {
        softwareForm.style.display = "none";
    });

    // Manejar la acción de guardar (crear o actualizar)
    softwareFormElement.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevoSoftware = {
            title: document.getElementById("software-title").value,
            description: document.getElementById("software-description").value,
            features: document.getElementById("software-features").value.split(','),
            price: document.getElementById("software-price").value,
            image_url: document.getElementById("software-image").value,
        };

        if (editando) {
            // Realizar un PUT para actualizar el software
            actualizarSoftware(softwareId, nuevoSoftware);
        } else {
            // Realizar un POST para agregar un nuevo software
            agregarSoftware(nuevoSoftware);
        }

        softwareForm.style.display = "none";
    });
});

// Función para cargar software desde el backend
function cargarSoftware() {
    fetch('/software')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';  // Limpiar la lista de productos para evitar duplicados

            data.forEach(software => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${software.image_url}" alt="${software.title}">
                    <h3>${software.title}</h3>
                    <p>${software.description}</p>
                    <ul>
                        ${software.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div>Costo: $${software.price}/mes</div>
                    <button onclick="editarSoftware('${software.id}')">Editar</button>
                    <button onclick="eliminarSoftware('${software.id}')">Eliminar</button>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error al cargar el software:', error));
}

// Función para agregar un nuevo software
function agregarSoftware(software) {
    fetch('/software', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(software)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarSoftware();  // Recargar la lista de software
    })
    .catch(error => console.error('Error al agregar software:', error));
}

// Función para editar software
function editarSoftware(id) {
    fetch(`/software1/${id}`)  // Hacemos una solicitud GET para obtener el software
        .then(response => response.json())
        .then(data => {
            // Llenamos el formulario con los datos del software
            document.getElementById("software-title").value = data.title;
            document.getElementById("software-description").value = data.description;
            document.getElementById("software-features").value = data.features.join(',');
            document.getElementById("software-price").value = data.price;
            document.getElementById("software-image").value = data.image_url;
            
            document.getElementById("software-form").style.display = "block";  // Mostrar el formulario

            softwareId = id;  // Guardar el ID para cuando actualicemos
            editando = true;  // Establecer en modo edición
        })
        .catch(error => console.error('Error al cargar software para editar:', error));
}

// Función para actualizar software
function actualizarSoftware(id, software) {
    fetch(`/software1/${id}`, {  // Hacemos una solicitud PUT para actualizar el software
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(software)  // Enviamos los datos del software como JSON
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Mostrar mensaje de éxito
        cargarSoftware();  // Recargar la lista de software
    })
    .catch(error => console.error('Error al actualizar software:', error));
}

// Función para eliminar software
function eliminarSoftware(id) {
    fetch(`/software/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarSoftware();  // Recargar la lista de software
    })
    .catch(error => console.error('Error al eliminar software:', error));
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById("software-title").value = '';
    document.getElementById("software-description").value = '';
    document.getElementById("software-features").value = '';
    document.getElementById("software-price").value = '';
    document.getElementById("software-image").value = '';
}
