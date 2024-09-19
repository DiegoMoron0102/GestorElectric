document.getElementById('deviceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const deviceData = {
        name: document.getElementById('deviceName').value,
        status: document.getElementById('deviceStatus').value,
    };

    // Llamada a la API para añadir el dispositivo
    fetch('https://tuapi.com/dispositivos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
    })
    .then(response => response.json())
    .then(data => {
        // Aquí puedes hacer algo con la respuesta de la API
        console.log('Dispositivo añadido:', data);
        // Refrescar la lista de dispositivos o mostrar una notificación
    })
    .catch(error => {
        console.error('Error al añadir el dispositivo:', error);
    });
});
