from flask import Blueprint, request, jsonify, render_template,redirect,url_for,session,flash
from firebase_admin import firestore
from datetime import datetime

# Crear el Blueprint
premium_bp = Blueprint('premium_bp', __name__)

# Inicializar Firestore
db = firestore.client()

@premium_bp.route('/comprar_premium', methods=['POST'])
def comprar_premium():
    user_id = session.get('user')  # Cambié 'user_id' por 'user' para que coincida con el inicio de sesión
    if not user_id:
        flash('Error: Usuario no encontrado.', 'error')
        print('Error: Usuario no encontrado en la sesión.')
        return redirect(url_for('version_freemium'))

    try:
        # Actualizar el rol en Firestore
        db.collection('users').document(user_id).update({
            'role': 'PremiumUser'
        })
        print(f'Usuario {user_id} actualizado a PremiumUser')

        # Actualizar la sesión del usuario
        session['role'] = 'PremiumUser'

        flash('Felicidades, ahora eres un usuario Premium.', 'success')
        return redirect(url_for('home'))

    except Exception as e:
        print(f"Error al actualizar el rol: {e}")
        flash('Hubo un problema al actualizar tu cuenta. Inténtalo más tarde.', 'error')
        return redirect(url_for('version_freemium'))




