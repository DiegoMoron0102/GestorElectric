// Función para manejar el login en el frontend
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'email': email,
            'password': password
        })
    });

    const data = await response.json();

    if (response.ok) {
        // Guardar los datos en localStorage
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name);

        // Redirigir al home
        window.location.href = '/';
    } else {
        alert('Error al iniciar sesión. Intenta de nuevo.');
    }
}

// Asignar la función de login al botón de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});
