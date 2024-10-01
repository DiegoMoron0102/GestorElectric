# Ruta: controllers/usuario_controller.py
from flask import Blueprint, jsonify, session, flash, redirect, url_for
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
