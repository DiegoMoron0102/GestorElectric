// Simulamos que obtenemos el rol del usuario (en el futuro, podría venir de un backend)
let userRole = localStorage.getItem('userRole') || "Usuario Nuevo";// Cambia entre "Usuario Nuevo", "Cliente Registrado", "Admin"
let name = localStorage.getItem('userName')
// Referencia al elemento del navbar
const navbar = document.getElementById("navbar");

// Función que genera el menú de navegación según el rol
function renderNavbar(role) {
    let navItems = '';

    if (role === "Usuario Nuevo") {
        navItems = `
            <li><a href="/app/controllers/frontend/Home.html">Inicio</a></li>
            <li><a href="/app/controllers/frontend/F_user/Soporte.html">Soporte Técnico</a></li>
            <li><a href="/app/controllers/frontend/F_user/Software.html">Software</a></li>
            <li><a href="/app/controllers/frontend/Login.html">Inicio Sesión</a></li>
        `;
    } else if (role === "Cliente Registrado") {
        navItems = `
            <li><a href="/app/controllers/frontend/Home.html">Inicio</a></li>
            <li><a href="/app/controllers/frontend/F_user/UserPanelControl.html">Mis Redes</a></li>
            <li><a href="/app/controllers/frontend/F_user/Informes.html">Informes</a></li>
            <li><a href="/app/controllers/frontend/F_user/Software.html">Software</a></li>
            <li><a href="/app/controllers/frontend/F_user/Soporte.html">Soporte Técnico</a></li>
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
            <li><a href="/app/controllers/frontend/F_admin/GestionInventarios.html">Gestión Inventarios</a></li>
            <li><a href="/app/controllers/frontend/F_admin/PanelControl.html">Gestión redes clientes</a></li>
            <li><a href="/app/controllers/frontend/F_admin/GestionSoftware.html">Gestión Software</a></li>
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
        window.location.href = '/app/controllers/frontend/Home.html';
    });
}

// Llamamos a la función de renderizado del navbar
renderNavbar(userRole);
