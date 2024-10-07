// Ruta: static/js/InfoUsuario.js

window.onload = function() {
    // Hacer la solicitud para obtener los datos del usuario
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

            // Habilitar la edición al hacer clic en el botón "Editar"
            document.getElementById('editButton').onclick = function() {
                enableEditing();
            };
        })
        .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
            alert("Hubo un error al cargar los datos del usuario.");
        });

    // Manejar el evento de guardar
    document.getElementById('userInfoForm').onsubmit = function(event) {
        event.preventDefault(); // Evitar el envío por defecto del formulario
        saveUserInfo();
    };
};

function enableEditing() {
    // Solo habilitar la fecha de nacimiento y dirección
    document.getElementById('birthdate').disabled = false;
    document.getElementById('address').disabled = false;

    document.getElementById('editButton').style.display = 'none';
    document.getElementById('saveButton').style.display = 'inline';
}

function saveUserInfo() {
    const userData = {
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value
    };

    fetch('/info_usuario/editar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error al actualizar la información.');
        } else {
            alert('La información se actualizó correctamente.');
            // Desactivar los campos nuevamente
            document.getElementById('birthdate').disabled = true;
            document.getElementById('address').disabled = true;

            document.getElementById('saveButton').style.display = 'none';
            document.getElementById('editButton').style.display = 'inline';
        }
    })
    .catch(error => {
        console.error('Error al actualizar la información del usuario:', error);
        alert('Hubo un error al actualizar la información.');
    });
}
