from flask import Blueprint, request, session, redirect, url_for, flash, render_template
from firebase_admin import firestore
from datetime import datetime

# Crear el Blueprint
usuario_bp = Blueprint('usuario_bp', __name__)

# Inicializar Firestore
db = firestore.client()

# Ruta para cargar la información del usuario
@usuario_bp.route('/info_usuario')
def info_usuario():
    user_id = session.get('user')  # Obtener el ID del usuario desde la sesión
    if not user_id:
        flash('Error: Usuario no encontrado.', 'error')
        return redirect(url_for('autenticacion_bp.login'))

    try:
        # Obtener la información del usuario desde Firestore
        user_data = db.collection('users').document(user_id).get().to_dict()
        if not user_data:
            flash('Error al cargar la información del usuario.', 'danger')
            return redirect(url_for('home'))

        # Pasar la información del usuario a la plantilla
        return render_template('F_user/InfoUsuario.html', user=user_data)

    except Exception as e:
        print(f"Error al obtener la información del usuario: {e}")
        flash('Hubo un problema al cargar la información del usuario.', 'error')
        return redirect(url_for('home'))

# Ruta para actualizar la información del usuario
@usuario_bp.route('/info_usuario/editar', methods=['POST'])
def editar_info_usuario():
    user_id = session.get('user')
    if not user_id:
        flash('Error: Usuario no encontrado.', 'error')
        return redirect(url_for('autenticacion_bp.login'))

    try:
        # Obtener los nuevos datos del formulario
        name = request.form.get('name')
        email = request.form.get('email')
        role = request.form.get('role')
        birthdate = request.form.get('birthdate')
        address = request.form.get('address')

        # Actualizar la información del usuario en Firestore
        db.collection('users').document(user_id).update({
            'name': name,
            'email': email,
            'role': role,
            'birthdate': birthdate,
            'address': address
        })

        # Actualizar la sesión si es necesario
        session['name'] = name
        session['email'] = email
        session['role'] = role

        flash('La información del usuario ha sido actualizada correctamente.', 'success')
        return redirect(url_for('usuario_bp.info_usuario'))

    except Exception as e:
        print(f"Error al actualizar la información del usuario: {e}")
        flash('Hubo un problema al actualizar la información.', 'error')
        return redirect(url_for('usuario_bp.info_usuario'))
