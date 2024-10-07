import random
import string
from flask import Blueprint, request, session, redirect, url_for, flash, jsonify, render_template
from firebase_admin import firestore

# Inicializar Firestore
db = firestore.client()

# Crear el Blueprint
compras_bp = Blueprint('compras_bp', __name__)

# Ruta para mostrar la página de compra del software
@compras_bp.route('/comprar_software/<no_serie>', methods=['POST'])
def comprar_software(no_serie):
    print(f"Procesando compra para el NoSerie: {no_serie}")

    # Verificar si el usuario está autenticado
    if 'user' not in session:
        flash("Debe iniciar sesión para realizar una compra.", "danger")
        return redirect(url_for('autenticacion_bp.login'))

    # Lógica para procesar la compra aquí...

    # Respuesta con éxito
    return jsonify({'success': True, 'codigo_compra': 'CODIGO123'})





# Ruta para la página de éxito
@compras_bp.route('/compra_exitosa/<codigo_compra>', methods=['GET'])
def compra_exitosa(codigo_compra):
    return render_template('F_user/compraExitosa.html', codigo_compra=codigo_compra)

