// Información simulada del usuario
const user = {
    role: 'Admin',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: '123456',
    birthdate: '1990-05-15',
    address: 'Calle Falsa 123'
};

localStorage.setItem('userBirthdate', user.birthdate);
localStorage.setItem('userAddress', user.address);

// Cargar datos desde localStorage
document.getElementById('name').value = localStorage.getItem('userName');
document.getElementById('email').value = localStorage.getItem('userEmail');
document.getElementById('role').value = localStorage.getItem('userRole');
document.getElementById('birthdate').value = localStorage.getItem('userBirthdate');
document.getElementById('address').value = localStorage.getItem('userAddress');
document.getElementById('password').value = localStorage.getItem('userPassword');

// Habilitar edición
document.getElementById('editButton').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });

    const button = document.getElementById('editButton');
    if (inputs[0].disabled) {
        button.textContent = 'Editar Información';
        // Guardar los datos editados en localStorage
        localStorage.setItem('userName', document.getElementById('name').value);
        localStorage.setItem('userEmail', document.getElementById('email').value);
        localStorage.setItem('userRole', document.getElementById('role').value);
        localStorage.setItem('userBirthdate', document.getElementById('birthdate').value);
        localStorage.setItem('userAddress', document.getElementById('address').value);
        localStorage.setItem('userPassword', document.getElementById('password').value);
    } else {
        button.textContent = 'Guardar Cambios';
    }
});
