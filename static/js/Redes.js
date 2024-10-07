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
                    <button onclick="verDetalles('${red.id}')">Ver Detalles</button>
                    <button onclick="editarRed('${red.id}')">Editar</button>
                    <button onclick="eliminarRed('${red.id}')">Eliminar</button>
                `;
                redList.appendChild(redCard);
            });
        })
        .catch(error => console.error('Error al cargar las redes:', error));
}

// Función para agregar una nueva red
document.getElementById('redForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevaRed = {
        fecha_registro: document.getElementById('fechaRegistro').value,
        fecha_instalacion: document.getElementById('fechaInstalacion').value,
        nro_medidor: document.getElementById('nroMedidor').value,
        plano_instalacion: document.getElementById('planoInstalacion').value,
        direccion: document.getElementById('direccionRed').value,
        consumo_mensual: document.getElementById('consumoMensual').value,
        monto_aprox: document.getElementById('montoAprox').value
    };

    fetch('/redes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaRed)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarRedes(); // Recargar la lista de redes
        document.getElementById('redForm').reset();  // Limpiar el formulario
        document.getElementById('form-agregar-red').style.display = 'none';  // Ocultar el formulario después de agregar
    })
    .catch(error => console.error('Error al agregar la red:', error));
});

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
    // Aquí puedes implementar la lógica para editar la red
    alert('Función de edición por implementar.');
}
