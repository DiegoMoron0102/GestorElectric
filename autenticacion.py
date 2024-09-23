import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Blueprint, request, session, redirect, url_for, flash, render_template, jsonify

# Configuración de Pyrebase
firebase_config = {
    "apiKey": "AIzaSyC15IpGvyLiadlVbBb-hM8d-j0R2ooBG9M",
    "authDomain": "gestorelectric-5d20a.firebaseapp.com",
    "databaseURL": "https://chuno-6384b-default-rtdb.firebaseio.com",
    "projectId": "gestorelectric-5d20a",
    "storageBucket": "gestorelectric-5d20a.appspot.com",
    "messagingSenderId": "581989440987",
    "appId": "1:581989440987:web:419be3a9d0e94362365bfe",
    "measurementId": "G-MD8L67NYB1"
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# Verificar si Firebase Admin ya ha sido inicializado
if not firebase_admin._apps:
    print("Inicializando Firebase Admin SDK...")
    cred = credentials.Certificate('gestorelectric-5d20a-firebase-adminsdk-z48lc-10fa512203.json')
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK inicializado correctamente.")
else:
    print("Firebase Admin SDK ya estaba inicializado.")

# Inicializar Firestore
db = firestore.client()

# Crear el Blueprint
autenticacion_bp = Blueprint('autenticacion_bp', __name__)

# Ruta para manejar el registro
@autenticacion_bp.route('/F_user/RegistroUsuario', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        repeat_password = request.form['repeat-password']
        company = request.form['company']

        if password != repeat_password:
            flash("Las contraseñas no coinciden, intenta de nuevo.", "danger")
            return redirect(url_for('autenticacion_bp.signup'))

        try:
            # Registrar al usuario en Firebase Authentication
            user = auth.create_user_with_email_and_password(email, password)
            user_id = user['localId']  # ID del usuario creado

            # Guardar la información del usuario en Firestore con rol FreeUser por defecto
            db.collection('users').document(user_id).set({
                "email": email,
                "company": company,
                "name": "Usuario Nuevo",  # Nombre por defecto, puede personalizarse más adelante
                "role": "FreeUser"  # Rol por defecto
            })

            flash("Registro exitoso, por favor inicia sesión", "success")
            return redirect(url_for('autenticacion_bp.login'))

        except Exception as e:
            flash(f"Error en el registro: {e}", "danger")
            return redirect(url_for('autenticacion_bp.signup'))

    return render_template('/F_user/RegistroUsuario.html')

# Ruta para manejar el login
@autenticacion_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        try:
            # Iniciar sesión con Firebase
            user = auth.sign_in_with_email_and_password(email, password)
            user_id = user['localId']

            # Obtener la información del usuario desde Firestore
            user_data = db.collection('users').document(user_id).get().to_dict()

            if not user_data:
                flash("Error: Usuario no encontrado en la base de datos.", "danger")
                return redirect(url_for('autenticacion_bp.login'))

            # Guardar la información en la sesión
            session['user'] = user_id
            session['email'] = user_data.get('email')
            session['role'] = user_data.get('role')
            session['name'] = user_data.get('name')

            flash('Inicio de sesión exitoso', 'success')

            # Enviar la información del usuario al frontend
            return jsonify({
                "name": user_data.get('name'),
                "role": user_data.get('role')
            })

        except Exception as e:
            flash(f"Error al iniciar sesión: {e}", "danger")
            return redirect(url_for('autenticacion_bp.login'))

    return render_template('Login.html')

# Ruta para manejar el cierre de sesión
@autenticacion_bp.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('email', None)
    session.pop('role', None)
    session.pop('name', None)
    flash("Has cerrado sesión correctamente", "success")
    return redirect(url_for('autenticacion_bp.login'))
