from flask import Blueprint, request, jsonify, render_template, session
from firebase_admin import firestore

# Inicializar Firestore
db = firestore.client()

# Crear el Blueprint para el módulo contable
modulo_contable_bp = Blueprint('modulo_contable_bp', __name__)


# Ruta para mostrar la página del módulo contable
@modulo_contable_bp.route('/admin/modulo_contable')
def modulo_contable():
    return render_template('F_admin/ModuloContable.html')

# Ruta para obtener todas las transacciones (Read)
@modulo_contable_bp.route('/contabilidad', methods=['GET'])
def obtener_transacciones():
    transacciones_ref = db.collection('contabilidad').stream()
    transacciones = []
    for transaccion in transacciones_ref:
        transaccion_dict = transaccion.to_dict()  # Obtener el diccionario de datos
        transaccion_dict['id'] = transaccion.id   # Añadir el ID del documento
        transacciones.append(transaccion_dict)    # Añadir al resultado
    return jsonify(transacciones)         

# Ruta para añadir una nueva transacción (Create)
@modulo_contable_bp.route('/contabilidad', methods=['POST'])
def agregar_transaccion():
    try:
        data = request.json
        if not validar_transaccion(data):
            return jsonify({"error": "Datos inválidos"}), 400
        nueva_transaccion = db.collection('contabilidad').add(data)
        return jsonify({"id": nueva_transaccion[1].id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para editar una transacción (Update)
@modulo_contable_bp.route('/contabilidad/<id>', methods=['PUT'])
def editar_transaccion(id):
    try:
        data = request.json
        if not validar_transaccion(data):
            return jsonify({"error": "Datos inválidos"}), 400
        db.collection('contabilidad').document(id).update(data)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para eliminar una transacción (Delete)
@modulo_contable_bp.route('/contabilidad/<id>', methods=['DELETE'])
def eliminar_transaccion(id):
    try:
        db.collection('contabilidad').document(id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Función de validación de los datos
def validar_transaccion(data):
    try:
        # Verificar que todos los campos existen y que el monto es un número
        return (
            'tipo' in data and 
            data['tipo'] in ['ingreso', 'gasto'] and
            'monto' in data and 
            isinstance(data['monto'], (int, float)) and 
            'descripcion' in data and 
            'fecha' in data
        )
    except KeyError:
        return False
