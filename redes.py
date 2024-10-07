from flask import Blueprint, request, jsonify, session, flash, redirect, url_for
from firebase_admin import firestore

# Conectar con Firestore
db = firestore.client()

# Crear el blueprint para ABM
redes_bp = Blueprint('redes_bp', __name__)



@redes_bp.route('/redes', methods=['GET'])
def get_networks():
    user_id = session.get('user')  # Obtener el ID del usuario desde la sesión
    user_role = session.get('role')  # Obtener el rol del usuario desde la sesión
    user_empresa = session.get('company')  # Obtenemos la empresa de la sesión, pero cambiaremos el nombre a empresa

    if not user_id or not user_role or not user_empresa:
        return jsonify({'message': 'Usuario no autenticado.'}), 401

    networks = []

    if user_role == 'Admin':
        # Si es administrador, obtener todas las redes
        networks_ref = db.collection('redes').stream()
    else:
        # Si es un usuario normal, filtrar las redes por el campo 'empresa'
        networks_ref = db.collection('redes').where('empresa', '==', user_empresa).stream()

    for network in networks_ref:
        network_data = network.to_dict()
        network_data['id'] = network.id
        networks.append(network_data)

    return jsonify(networks), 200


# Ruta para obtener una red específica por su ID
@redes_bp.route('/redes/<id>', methods=['GET'])
def get_network(id):
    try:
        # Obtener el documento de la red en Firestore
        network_doc = db.collection('redes').document(id).get()

        if not network_doc.exists:
            return jsonify({'message': 'Red no encontrada'}), 404

        # Convertir el documento a un diccionario y devolverlo como JSON
        network = network_doc.to_dict()
        network['id'] = network_doc.id
        return jsonify(network), 200

    except Exception as e:
        print(f"Error al obtener la red: {e}")
        return jsonify({'error': 'Hubo un problema al obtener la red.'}), 500

# Ruta para agregar una red
@redes_bp.route('/redes', methods=['POST'])
def add_network():
    data = request.get_json()

    # Obtener el user_id de la sesión
    user_id = session.get('user')  # Aquí utilizo la clave "user" como en tu código de usuario

    if not user_id:
        flash('Error: Usuario no encontrado en la sesión.', 'error')
        return jsonify({'message': 'Usuario no autenticado'}), 401

    try:
        # Obtener el documento del usuario desde la colección 'users'
        user_doc = db.collection('users').document(user_id).get()

        if not user_doc.exists:
            return jsonify({'message': 'No se encontró el usuario en la base de datos'}), 404

        # Obtener la empresa desde el documento del usuario
        user_data = user_doc.to_dict()
        empresa = user_data.get('company')

        if not empresa:
            return jsonify({'message': 'No se encontró la empresa del usuario'}), 400

        # Crear el nuevo registro de la red con los datos enviados más el nombre de la empresa
        new_network = {
            'fecha_registro': data.get('fecha_registro'),
            'fecha_instalacion': data.get('fecha_instalacion'),
            'nro_medidor': data.get('nro_medidor'),
            'plano_instalacion': data.get('plano_instalacion'),
            'direccion': data.get('direccion'),
            'consumo_mensual': data.get('consumo_mensual'),
            'monto_aprox': data.get('monto_aprox'),
            'empresa': empresa  # Agregar el nombre de la empresa desde el documento de usuario
        }

        db.collection('redes').add(new_network)
        return jsonify({'message': 'Red agregada con éxito'}), 201

    except Exception as e:
        print(f"Error al agregar la red: {e}")
        return jsonify({'error': 'Hubo un problema al agregar la red.'}), 500

# Ruta para editar una red
@redes_bp.route('/redes/<id>', methods=['PUT'])
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
    return jsonify({'message': 'Red actualizada con éxito'}), 200

# Ruta para eliminar una red
@redes_bp.route('/redes/<id>', methods=['DELETE'])
def delete_network(id):
    db.collection('redes').document(id).delete()
    return jsonify({'message': 'Red eliminada con éxito'}), 200
