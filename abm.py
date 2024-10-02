from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore


# Conectar con Firestore
db = firestore.client()

# Crear el blueprint para ABM
abm_bp = Blueprint('abm_bp', __name__)

# Ruta para obtener redes
@abm_bp.route('/redes', methods=['GET'])
def get_networks():
    networks_ref = db.collection('redes')
    docs = networks_ref.stream()

    networks = []
    for doc in docs:
        network = doc.to_dict()
        network['id'] = doc.id
        networks.append(network)

    return jsonify(networks)

# Ruta para agregar una red
@abm_bp.route('/redes', methods=['POST'])
def add_network():
    data = request.get_json()

    new_network = {
        'fecha_registro': data.get('fecha_registro'),
        'fecha_instalacion': data.get('fecha_instalacion'),
        'nro_medidor': data.get('nro_medidor'),
        'plano_instalacion': data.get('plano_instalacion'),
        'direccion': data.get('direccion'),
        'consumo_mensual': data.get('consumo_mensual'),
        'monto_aprox': data.get('monto_aprox')
    }

    db.collection('redes').add(new_network)
    return jsonify({'message': 'Red agregada con éxito'}), 201

# Ruta para editar una red
@abm_bp.route('/redes/<id>', methods=['PUT'])
def update_network(id):
    data = request.get_json()

    updated_network = {
        'fecha_registro': data.get('fecha_registro'),
        'fecha_instalacion': data.get('fecha_instalacion'),
        'nro_medidor': data.get('nro_medidor'),
        'plano_instalacion': data.get('plano_instalacion'),
        'direccion': data.get('direccion'),
        'consumo_mensual': data.get('consumo_mensual'),
        'monto_aprox': data.get('monto_aprox')
    }

    db.collection('redes').document(id).update(updated_network)
    return jsonify({'message': 'Red actualizada con éxito'})

# Ruta para eliminar una red
@abm_bp.route('/redes/<id>', methods=['DELETE'])
def delete_network(id):
    db.collection('redes').document(id).delete()
    return jsonify({'message': 'Red eliminada con éxito'})