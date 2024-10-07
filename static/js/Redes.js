document.addEventListener("DOMContentLoaded", () => {
    cargarRedes(); // Cargar redes cuando la página cargue

    // Mostrar y ocultar el formulario
    const mostrarFormBtn = document.getElementById('mostrar-form-btn');
    const formAgregarRed = document.getElementById('form-agregar-red');

    mostrarFormBtn.addEventListener('click', () => {
        if (formAgregarRed.style.display === 'none') {
            formAgregarRed.style.display = 'block';  // Mostrar el formulario
        } else {
            formAgregarRed.style.display = 'none';  // Ocultar el formulario
        }
    });
});

// Función para cargar redes desde el backend
function cargarRedes() {
    fetch('/redes')
        .then(response => response.json())
        .then(data => {
            const redList = document.getElementById('red-list');
            redList.innerHTML = ''; // Limpiar la lista de redes

            data.forEach(red => {
                const redCard = document.createElement('div');
                redCard.classList.add('red-card');
                redCard.innerHTML = `
                    <h3>${red.nro_medidor}</h3>
                    <p>Fecha de Registro: ${red.fecha_registro}</p>
                    <p>Fecha de Instalación: ${red.fecha_instalacion}</p>
                    <p>Dirección: ${red.direccion}</p>
                    <p>Consumo Mensual: ${red.consumo_mensual}</p>
                    <p>Monto Aproximado: ${red.monto_aprox}</p>
                    <button onclick="editarRed('${red.id}')">Editar</button>
                    <button onclick="eliminarRed('${red.id}')">Eliminar</button>
                `;
                redList.appendChild(redCard);
            });
        })
        .catch(error => console.error('Error al cargar las redes:', error));
}

// Función para agregar o actualizar una red
function addOrUpdateNetwork() {
    const id = $("#id").val();
    const data = {
        fecha_registro: $("#fecha_registro").val(),
        fecha_instalacion: $("#fecha_instalacion").val(),
        nro_medidor: $("#nro_medidor").val(),
        plano_instalacion: $("#plano_instalacion").val(),
        direccion: $("#direccion").val(),
        consumo_mensual: $("#consumo_mensual").val(),  // Enviar solo el consumo
    };

    let url = '/redes';
    let method = 'POST';

    if (id) {
        url = `/redes/${id}`;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarRedes();
        $("#network-modal").hide();  // Ocultar el modal después de guardar
    })
    .catch(error => console.error('Error:', error));
}

// Función para eliminar una red
function eliminarRed(id) {
    fetch(`/redes/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarRedes(); // Recargar la lista de redes
    })
    .catch(error => console.error('Error al eliminar la red:', error));
}

// Función para editar una red (requiere ajustes adicionales para un formulario de edición)
function editarRed(id) {
    fetch(`/redes/${id}`)
        .then(response => response.json())
        .then(red => {
            $("#network-modal").show();  // Mostrar el modal
            $("#id").val(red.id);
            $("#fecha_registro").val(red.fecha_registro);
            $("#fecha_instalacion").val(red.fecha_instalacion);
            $("#nro_medidor").val(red.nro_medidor);
            $("#plano_instalacion").val(red.plano_instalacion);
            $("#direccion").val(red.direccion);
            $("#consumo_mensual").val(red.consumo_mensual);
        });
}
