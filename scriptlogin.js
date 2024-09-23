// Simulamos una base de datos con dos tipos de usuarios: cliente y administrador
const usuarios = [
    { email: 'admin@empresa.com', password: 'admin123', rol: 'administrador' },
    { email: 'cliente@empresa.com', password: 'cliente123', rol: 'cliente' }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar usuario
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
        // Almacenar en localStorage o sessionStorage
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

        // Redirigir a infoUsuario.html
        window.location.href = 'infoUsuario.html';
    } else {
        alert('Correo o contraseña incorrectos');
    }
});
