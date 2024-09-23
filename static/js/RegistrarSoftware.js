document.getElementById('add-software-btn').addEventListener('click', function() {
    document.getElementById('add-software-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('add-software-modal').style.display = 'none';
});

document.getElementById('software-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Aquí se manejaría la lógica para añadir el software a la lista.
    alert('Software añadido: ' + document.getElementById('software-name').value);
    document.getElementById('add-software-modal').style.display = 'none';
    // También se debería reiniciar el formulario si es necesario.
});
