document.addEventListener("DOMContentLoaded", () => {
    cargarSoftware();  // Cargar la lista de software al cargar la página
});

// Función para cargar software desde el backend
function cargarSoftware() {
    fetch('/software')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';  // Limpiar la lista de productos

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
                    <div class="price">Costo: $${software.price}/mes</div>
                    <button class="buy-button" onclick="comprarSoftware('${software.id}', '${software.title}')">Comprar</button>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error al cargar el software:', error));
}

// Función para comprar software
function comprarSoftware(id, title) {
    // Redirigir a la ruta de Flask para la compra del software
    window.location.href = `/user/comprar_software?software_id=${id}`;
}
