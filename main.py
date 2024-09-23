from flask import Flask, render_template
from autenticacion import autenticacion_bp  # Importa tu blueprint de autenticación

app = Flask(__name__)

# Añadir secret key
app.secret_key = 'una_clave_secreta_muy_segura'

# Registrar el blueprint de autenticación
app.register_blueprint(autenticacion_bp)

# Ruta para la página principal (home)
@app.route('/inicio')
def home():
    return render_template('Home.html')

# Rutas de autenticación
@app.route('/login')
def login():
    return render_template('Login.html')

@app.route('/recuperar_contraseña')
def recuperar_contraseña():
    return render_template('RecuperarContraseña.html')

# Rutas para la versión freemium
@app.route('/version_freemium')
def version_freemium():
    return render_template('VersionFreemium.html')

# Rutas del administrador
@app.route('/admin/generacion_informes')
def generacion_informes():
    return render_template('F_admin/GeneracionInformes.html')

@app.route('/admin/gestion_inventarios')
def gestion_inventarios():
    return render_template('F_admin/GestionInventarios.html')

@app.route('/admin/gestion_software')
def gestion_software():
    return render_template('F_admin/GestionSoftware.html')

@app.route('/admin/informe_seguridad')
def informe_seguridad():
    return render_template('F_admin/InformeSeguridadPag.html')

@app.route('/admin/panel_control')
def panel_control():
    return render_template('F_admin/PanelControl.html')

# Rutas del usuario (F_user)
@app.route('/user/informes')
def informes():
    return render_template('F_user/Informes.html')

@app.route('/user/registro_usuario', methods=['GET', 'POST'])
def registro_usuario():
    if request.method == 'POST':
        # Lógica para registrar al usuario
        pass
    return render_template('F_user/RegistroUsuario.html')

@app.route('/user/software')
def software():
    return render_template('F_user/Software.html')

@app.route('/user/soporte')
def soporte():
    return render_template('F_user/Soporte.html')

@app.route('/user/panel_control')
def user_panel_control():
    return render_template('F_user/UserPanelControl.html')

@app.route('/user/comprar_software')
def comprar_software():
    return render_template('F_user/comprarSoftware.html')

if __name__ == '__main__':
    app.run(debug=True)
