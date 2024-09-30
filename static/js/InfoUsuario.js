document.getElementById('editButton').addEventListener('click', function() {
    // Habilitar los campos del formulario
    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('role').disabled = false;
    document.getElementById('birthdate').disabled = false;
    document.getElementById('address').disabled = false;

    // Mostrar el botón de guardar
    document.getElementById('saveButton').style.display = 'inline-block';

    // Ocultar el botón de editar
    this.style.display = 'none';
});
