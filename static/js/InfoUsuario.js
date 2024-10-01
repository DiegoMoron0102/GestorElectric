// Ruta: static/js/InfoUsuario.js

// Al cargar la página, hacemos la solicitud para obtener los datos del usuario
window.onload = function() {
    fetch('/info_usuario_datos')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                alert("Error al cargar los datos del usuario.");
                return;
            }

            // Llenar los campos del formulario con los datos obtenidos
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('role').value = data.role || '';
            document.getElementById('birthdate').value = data.birthdate || '';
            document.getElementById('address').value = data.address || '';

        })
        .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
            alert("Hubo un error al cargar los datos del usuario.");
        });
};
