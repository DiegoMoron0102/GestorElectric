document.addEventListener("DOMContentLoaded", () => {
    let redesCache = [];  // Caché para almacenar todas las redes obtenidas del servidor

    // Cargar redes cuando la página cargue sin filtro
    cargarRedes(); 

    // Asegurarse de que el modal esté oculto al cargar la página
    $("#network-modal").hide();  // Ocultar el modal inicialmente

    // Filtrar redes en tiempo real cuando el usuario escribe en el campo de búsqueda
    const empresaInput = document.getElementById('empresa-input');
    empresaInput.addEventListener('input', () => {
        const empresa = empresaInput.value.toLowerCase();  // Convertir la entrada a minúsculas para evitar problemas de mayúsculas/minúsculas
        console.log("Filtrando redes por empresa:", empresa);
        filtrarRedes(empresa);  // Filtrar localmente las redes en el caché
    });

    // Función para cargar redes desde el backend
    function cargarRedes() {
        fetch('/redes')
            .then(response => response.json())
            .then(data => {
                redesCache = data;  // Guardar todas las redes en el caché
                filtrarRedes('');  // Mostrar todas las redes inicialmente
            })
            .catch(error => console.error('Error al cargar las redes:', error));
    }

    // Función para filtrar redes localmente
    function filtrarRedes(filtroEmpresa) {
        const redList = document.getElementById('network-table');
        redList.innerHTML = '';  // Limpiar la tabla de redes

        // Filtrar redes según el filtro ingresado
        const redesFiltradas = redesCache.filter(red => red.empresa.toLowerCase().includes(filtroEmpresa));

        // Mostrar las redes filtradas en la tabla
        redesFiltradas.forEach(red => {
            const redRow = document.createElement('tr');
            redRow.innerHTML = `
                <td>${red.id}</td>
                <td>${red.fecha_registro}</td>
                <td>${red.fecha_instalacion}</td>
                <td>${red.nro_medidor}</td>
                <td>${red.plano_instalacion}</td>
                <td>${red.direccion}</td>
                <td>${red.consumo_mensual}</td>
                <td>${red.monto_aprox}</td>
                <td>
                    <button class="btn btn-info" onclick="editarRed('${red.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarRed('${red.id}')">Eliminar</button>
                </td>
            `;
            redList.appendChild(redRow);
        });
    }
});

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

    console.log('Enviando nueva red:', nuevaRed);
    
    fetch('/redes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaRed)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta de creación de red:', data);
        cargarRedes(); // Recargar la lista de redes
        document.getElementById('redForm').reset();  // Limpiar el formulario
        document.getElementById('form-agregar-red').style.display = 'none';  // Ocultar el formulario después de agregar
    })
    .catch(error => console.error('Error al agregar la red:', error));
});

// Función para eliminar una red
function eliminarRed(id) {
    console.log('Eliminando red con ID:', id);
    
    fetch(`/redes/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta de eliminación de red:', data);
        cargarRedes(); // Recargar la lista de redes
    })
    .catch(error => console.error('Error al eliminar la red:', error));
}

// Función para editar una red (requiere ajustes adicionales para un formulario de edición)
function editarRed(id) {
    console.log('Función de edición por implementar para la red con ID:', id);
}
