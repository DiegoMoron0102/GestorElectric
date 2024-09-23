// Datos ficticios para usuarios y roles
const users = [
    {
        email: "usuario1@ejemplo.com",
        password: "12345",
        name: "Usuario Uno",
        role: "Usuario Nuevo"
    },
    {
        email: "cliente@ejemplo.com",
        password: "password123",
        name: "Cliente Juan",
        role: "Cliente Registrado"
    },
    {
        email: "admin@ejemplo.com",
        password: "adminpass",
        name: "Administrador Loquendo",
        role: "Admin"
    }
];

// Obtener referencia al formulario de inicio de sesión
const loginForm = document.getElementById('login-form');

// Al enviar el formulario
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener los valores del formulario
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // Validar las credenciales ingresadas con los usuarios ficticios
    const user = users.find(u => u.email === emailInput && u.password === passwordInput);

    if (user) {
        // Si el usuario es válido, guardamos el rol y el nombre en localStorage
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPassword', user.password);

        // Redirigimos a la página principal o a la página correspondiente
        window.location.href = 'Home.html'; // Cambia a la página donde el usuario será redirigido
    } else {
        // Si las credenciales no son correctas, mostramos una alerta o mensaje de error
        alert("Correo electrónico o contraseña incorrectos. Por favor, intenta de nuevo.");
    }
});
