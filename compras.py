import random
import string
from flask import Blueprint, request, session, redirect, url_for, flash, jsonify, render_template
from firebase_admin import firestore
import uuid

# Inicializar Firestore
db = firestore.client()

# Crear el Blueprint
compras_bp = Blueprint('compras_bp', __name__)

# Función para generar un código de compra aleatorio
def generar_codigo_compra():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

# Ruta para mostrar la página de compra del software
@compras_bp.route('/comprar_software/<no_serie>', methods=['POST'])
def comprar_software(no_serie):
    print(f"Procesando compra para el NoSerie: {no_serie}")

    # Verificar si el usuario está autenticado
    if 'user' not in session:
        flash("Debe iniciar sesión para realizar una compra.", "danger")
        return redirect(url_for('autenticacion_bp.login'))

    # Generar código de compra
    codigo_compra = generar_codigo_compra()
    
    # Datos de la compra
    compra = {
        'user_id': session['user'],  # ID del usuario desde la sesión
        'software_no_serie': no_serie,
        'codigo_compra': codigo_compra,
        'metodo_pago': request.json.get('metodo_pago'),
        'fecha_compra': firestore.SERVER_TIMESTAMP  # Timestamp de Firestore
    }

    # Guardar la compra en la colección de "compras" en Firestore
    db.collection('compras').add(compra)
    
    print(f"Compra guardada con éxito: {compra}")

    # Respuesta con éxito y redirección a la página de éxito
    return jsonify({'success': True, 'codigo_compra': codigo_compra})

# Ruta para la página de éxito
@compras_bp.route('/compra_exitosa/<codigo_compra>', methods=['GET'])
def compra_exitosa(codigo_compra):
    return render_template('F_user/compraExitosa.html', codigo_compra=codigo_compra)
