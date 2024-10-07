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

    # Generar un número de serie único (puedes ajustar la lógica si prefieres otra forma de generar el NoSerie)
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

# Ruta para actualizar un software
@software_bp.route('/software/<id>', methods=['PUT'])
def actualizar_software(id):
    data = request.get_json()

    actualizacion_software = {
        'title': data.get('title'),
        'description': data.get('description'),
        'features': data.get('features'),
        'price': data.get('price'),
        'image_url': data.get('image_url')
    }

    # Actualizar el software en la base de datos
    db.collection('software').document(id).update(actualizacion_software)
    return jsonify({'message': 'Software actualizado con éxito'})

# Ruta para eliminar un software
@software_bp.route('/software/<id>', methods=['DELETE'])
def eliminar_software(id):
    # Eliminar el software de la base de datos
    db.collection('software').document(id).delete()
    return jsonify({'message': 'Software eliminado con éxito'})

# Ruta para obtener precio con descuento
@software_bp.route('/software/precio/<id>', methods=['GET'])
def obtener_precio_con_descuento(id):
    user_role = request.args.get('role')  # Obtenemos el rol desde el frontend

    # Obtener el software desde la base de datos
    software_doc = db.collection('software').document(id).get()
    software_data = software_doc.to_dict()

    # Aplicar descuento si el usuario es premium
    if user_role == 'PremiumUser':
        precio_original = float(software_data['price'])
        descuento = precio_original * 0.20
        precio_final = precio_original - descuento
    else:
        precio_final = software_data['price']

    return jsonify({'price': precio_final})
