import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Blueprint, request, session, redirect, url_for, flash, render_template, jsonify

# Configuración de Pyrebase
firebase_config = {
    "apiKey": "AIzaSyCIeYBM8_pmHTB8M5WrKtiYs43STF-Sx2U",
    "authDomain": "chuno-6384b.firebaseapp.com",
    "databaseURL": "https://chuno-6384b-default-rtdb.firebaseio.com",
    "projectId": "chuno-6384b",
    "storageBucket": "chuno-6384b.appspot.com",
    "messagingSenderId": "961285732641",
    "appId": "1:961285732641:web:041aafd7d44b7c0051e660",
    "measurementId": "G-W41SD9B2W8"
}




firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# Verificar si Firebase Admin ya ha sido inicializado
if not firebase_admin._apps:
    print("Inicializando Firebase Admin SDK...")
    cred = credentials.Certificate('chuno-6384b-firebase-adminsdk-3tk2c-e0d37f9726.json')

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

            # Condición para asignar rol según el dominio del correo electrónico
            if email.endswith('@ucb.edu.bo'):
                user_role = 'Admin'
            else:
                user_role = 'FreeUser'  # Rol por defecto

            # Guardar la información del usuario en Firestore con rol FreeUser por defecto
            db.collection('users').document(user_id).set({
                "email": email,
                "company": company,
                "name": company,  # Nombre por defecto, puede personalizarse más adelante
                "role": user_role  # Rol por defecto
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
            session['company'] = user_data.get('company')
            

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