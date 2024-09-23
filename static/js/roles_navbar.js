// Simulamos que obtenemos el rol del usuario (en el futuro, podría venir de un backend)
let userRole = localStorage.getItem('userRole') || "Sin Registro"; // Cambia entre "Sin Registro", "FreeUser", "PremiumUser", "Admin"
let name = localStorage.getItem('userRole') || "Invitado";



// Referencia al elemento del navbar
const navbar = document.getElementById("navbar");

// Función que genera el menú de navegación según el rol
function renderNavbar(role) {
    let navItems = '';

    if (role === "Sin Registro") {
        navItems = `
            <li><a href="${homeUrl}">Inicio</a></li>
            <li><a href="${software}">Software</a></li>
            <li><a href="${soporteUrl}">Soporte Técnico</a></li>
            <li><a href="${loginUrl}">Iniciar Sesión</a></li>
        `;
    } else if (role === "FreeUser") {
        navItems = `
            <li><a href="${homeUrl}">Inicio</a></li>
            <li><a href="${software}">Software</a></li>
            <li><a href="${soporteUrl}">Soporte Técnico</a></li>
            <li><a href="/user/panel_control">Mis Redes</a></li>
            <li class="dropdown">
                <a href="#" class="dropbtn">${name} <span class="caret">▼</span></a>
                <div class="dropdown-content">
                    <a href="InfoUsuario.html">Info Usuario</a>
                    <a href="#" id="logout">Cerrar Sesión</a>
                </div>
            </li>
        `;
    } else if (role === "PremiumUser") {
        navItems = `
            <li><a href="${homeUrl}">Inicio</a></li>
            <li><a href="${software}">Software Premium</a></li>
            <li><a href="${soporteUrl}">Soporte Premium</a></li>
            <li><a href="/user/panel_control">Mis Redes</a></li>
            <li><a href="/user/informes">Informes Detallados</a></li>
            <li class="dropdown">
                <a href="#" class="dropbtn">${name} <span class="caret">▼</span></a>
                <div class="dropdown-content">
                    <a href="InfoUsuario.html">Info Usuario</a>
                    <a href="#" id="logout">Cerrar Sesión</a>
                </div>
            </li>
        `;
    } else if (role === "Admin") {
        navItems = `
            <li><a href="/admin/gestion_inventarios">Gestión Inventarios</a></li>
            <li><a href="/admin/panel_control">Gestión Redes Clientes</a></li>
            <li><a href="/admin/gestion_software">Gestión Software</a></li>
            <li><a href="/admin/informe_seguridad">Informe de Seguridad</a></li>
            <li class="dropdown">
                <a href="#" class="dropbtn">${name} <span class="caret">▼</span></a>
                <div class="dropdown-content">
                    <a href="InfoUsuario.html">Info Usuario</a>
                    <a href="#" id="logout">Cerrar Sesión</a>
                </div>
            </li>
        `;
    }

    // Insertamos las opciones de navegación generadas en el navbar
    navbar.innerHTML = navItems;

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function() {
    // Limpiar el rol del usuario y redirigir a la página de login
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/logout';  // Redirigir a la ruta de Flask que maneja el logout
});

}

// Llamamos a la función de renderizado del navbar
renderNavbar(userRole);
