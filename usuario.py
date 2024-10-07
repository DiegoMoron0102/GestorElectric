# Ruta: controllers/usuario_controller.py
from flask import Blueprint, jsonify, session, flash, redirect, url_for,request
from firebase_admin import firestore

# Crear el Blueprint
usuario_bp = Blueprint('usuario_bp', __name__)

# Inicializar Firestore
db = firestore.client()

# Ruta para obtener los datos del usuario en formato JSON
@usuario_bp.route('/info_usuario_datos', methods=['GET'])
def info_usuario_datos():
    user_id = session.get('user')  # Obtener el ID del usuario desde la sesión
    if not user_id:
        flash('Error: Usuario no encontrado.', 'error')
        return redirect(url_for('autenticacion_bp.login'))

    try:
        # Obtener la información del usuario desde Firestore
        user_data = db.collection('users').document(user_id).get().to_dict()
        if not user_data:
            return jsonify({'error': 'No se encontraron datos del usuario.'}), 404

        return jsonify(user_data), 200

    except Exception as e:
        print(f"Error al obtener la información del usuario: {e}")
        return jsonify({'error': 'Hubo un problema al cargar la información del usuario.'}), 500
# Ruta para actualizar la información del usuario
@usuario_bp.route('/info_usuario/editar', methods=['POST'])
def editar_info_usuario():
    user_id = session.get('user')  # Obtener el ID del usuario desde la sesión
    if not user_id:
        return jsonify({'error': 'Usuario no encontrado en la sesión.'}), 403

    # Obtener los nuevos datos desde la solicitud
    user_data = request.get_json()

    try:
        # Actualizar solo los campos de nacimiento y dirección en Firestore
        db.collection('users').document(user_id).update({
            'birthdate': user_data.get('birthdate'),
            'address': user_data.get('address')
        })

        return jsonify({'message': 'Información actualizada correctamente'}), 200

    except Exception as e:
        print(f"Error al actualizar la información del usuario: {e}")
        return jsonify({'error': 'Hubo un problema al actualizar la información.'}), 500
