import uuid
from flask import Blueprint, request, jsonify
from firebase_admin import firestore

# Conectar con Firestore
db = firestore.client()

# Crear Blueprint para software
software_bp = Blueprint('software_bp', __name__)

# Estructura de datos del software con NoSerie
@software_bp.route('/software', methods=['POST'])
def agregar_software():
    data = request.get_json()

    # Generar un número de serie único
    no_serie = str(uuid.uuid4())  # Genera un UUID como número de serie

    nuevo_software = {
        'title': data.get('title'),
        'description': data.get('description'),
        'features': data.get('features'),
        'price': data.get('price'),
        'image_url': data.get('image_url'),
        'NoSerie': no_serie  # Agregar el número de serie al software
    }

    # Agregar nuevo software a la base de datos
    db.collection('software').add(nuevo_software)
    return jsonify({'message': 'Software agregado con éxito', 'NoSerie': no_serie}), 201

# Obtener o actualizar software por ID
@software_bp.route('/software1/<id>', methods=['GET', 'PUT'])
def obtener_o_actualizar_software(id):
    if request.method == 'GET':
        # Obtener software
        software_doc = db.collection('software').document(id).get()
        if not software_doc.exists:
            return jsonify({'message': 'Software no encontrado'}), 404
        software_data = software_doc.to_dict()
        return jsonify(software_data)
    
    if request.method == 'PUT':
        # Actualizar software
        data = request.get_json()
        actualizacion_software = {
            'title': data.get('title'),
            'description': data.get('description'),
            'features': data.get('features'),
            'price': data.get('price'),
            'image_url': data.get('image_url')
        }
        db.collection('software').document(id).update(actualizacion_software)
        return jsonify({'message': 'Software actualizado con éxito'})

# Ruta para eliminar un software
@software_bp.route('/software/<id>', methods=['DELETE'])
def eliminar_software(id):
    # Eliminar el software de la base de datos
    db.collection('software').document(id).delete()
    return jsonify({'message': 'Software eliminado con éxito'})


# Obtener software (función de lectura)
@software_bp.route('/software', methods=['GET'])
def obtener_software():
    software_ref = db.collection('software')
    docs = software_ref.stream()

    software_list = []
    for doc in docs:
        software = doc.to_dict()
        software['id'] = doc.id  # Añadir el ID del documento
        software_list.append(software)

    return jsonify(software_list)
