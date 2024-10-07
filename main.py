from flask import Flask, render_template,session,flash,redirect,url_for
from autenticacion import autenticacion_bp  # Importa tu blueprint de autenticación
from soporte import soporte_bp
from premium import premium_bp
from usuario import usuario_bp
from abm import abm_bp
from firebase_admin import firestore
from ModuloContable import modulo_contable_bp
app = Flask(__name__)

# Añadir secret key
app.secret_key = 'una_clave_secreta_muy_segura'

# Registrar el blueprint de autenticación
app.register_blueprint(autenticacion_bp)
app.register_blueprint(soporte_bp)
app.register_blueprint(premium_bp)
app.register_blueprint(usuario_bp)
app.register_blueprint(abm_bp)
app.register_blueprint(modulo_contable_bp)
# Ruta para la página principal (home)
@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/InfoUsuario')
def InfoUsuario():
    return render_template('info_user.html')

# Rutas de autenticación
@app.route('/login')
def login():
    return render_template('Login.html')

@app.route('/logout')
def logout():
    # Aquí limpiamos la sesión al cerrar sesión
    session.pop('user', None)
    session.pop('email', None)
    session.pop('role', None)
    session.pop('name', None)
    flash("Has cerrado sesión correctamente", "success")
    return redirect(url_for('autenticacion_bp.login'))


@app.route('/user/registro_usuario', methods=['GET', 'POST'])
def registro_usuario():
    return render_template('F_user/RegistroUsuario.html')


@app.route('/recuperar_contraseña')
def recuperar_contraseña():
    return render_template('RecuperarContraseña.html')

# Ruta para mostrar los mensajes de soporte
@app.route('/admin/mensajes_soporte')  # Verifica si la ruta es correcta
def mostrar_mensajes():
    return redirect(url_for('soporte_bp.listar_mensajes'))  # Redirigir al Blueprint de soporte

# Rutas para la versión freemium
@app.route('/version_freemium')
def version_freemium():
    return render_template('VersionFreemium.html')

# Ruta para mostrar los mensajes de soporte
@app.route('/comprar_premium')  # Verifica si la ruta es correcta
def comprar_premium():
    return redirect(url_for('premium_bp.comprar_premium'))  # Redirigir al Blueprint de soporte

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
    return render_template('F_admin/mensajes_soporte.html')

@app.route('/admin/panel_control')
def panel_control():
    return render_template('F_admin/PanelControl.html')

@app.route('/admin/modulo_contable')
def modulo_contable():
    return render_template('F_admin/ModuloContable.html')



# Rutas del usuario (F_user)
@app.route('/user/informes')
def informes():
    return render_template('F_user/Informes.html')

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