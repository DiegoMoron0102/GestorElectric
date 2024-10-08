from flask import Blueprint, request, jsonify
from firebase_admin import firestore

# Inicializar Firestore
db = firestore.client()

# Crear el Blueprint
codigo_bp = Blueprint('canjeo_bp', __name__)

# Ruta para verificar y canjear código
@codigo_bp.route('/canjear_codigo', methods=['POST'])
def canjear_codigo():
    data = request.get_json()
    codigo = data.get('codigo')

    # Buscar el código en la colección de compras
    compra_ref = db.collection('compras').where('codigo_compra', '==', codigo).stream()
    
    # Verificar si el código existe
    compra = None
    for doc in compra_ref:
        compra = doc.to_dict()
        doc_id = doc.id  # Obtenemos el ID del documento

    if compra:
        # Verificar si ya ha sido canjeado
        if compra.get('canjeado', False):
            return jsonify({'success': False, 'message': 'Este código ya fue canjeado.'})

        # Si no ha sido canjeado, marcar como canjeado y devolver el producto
        db.collection('compras').document(doc_id).update({'canjeado': True})

        return jsonify({'success': True, 'producto': compra.get('software_name')})
    else:
        return jsonify({'success': False, 'message': 'Código no válido.'})
