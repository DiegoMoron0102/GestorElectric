from flask import Blueprint, jsonify
import firebase_admin
from firebase_admin import firestore

# Crear el blueprint para informes
informes_bp = Blueprint('informes_bp', __name__)

# Conectar con Firestore
db = firestore.client()

# Ruta para obtener los datos de las redes y generar informes
@informes_bp.route('/informes_datos', methods=['GET'])
def get_informe_datos():
    try:
        redes_ref = db.collection('redes')
        docs = redes_ref.stream()

        redes_data = []
        for doc in docs:
            red = doc.to_dict()
            red['id'] = doc.id
            redes_data.append(red)

        return jsonify({'redes': redes_data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
