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
    user_empresa = session.get('company')  # Obtener la empresa del usuario desde la sesión
    empresa_filtro = request.args.get('empresa', '')  # Obtener el filtro de empresa si se proporciona

    print(f'Filtrando redes por empresa: {empresa_filtro}')  # Verificar que el filtro se está capturando

    networks = []

    try:
        # Si el usuario es administrador, puede ver todas las redes o filtrar por empresa
        if user_role == 'Admin':
            if empresa_filtro:
                # Filtrar redes por empresa, utilizando rangos
                empresa_filtro_capitalizada = empresa_filtro.capitalize()
                start_at = empresa_filtro_capitalizada
                end_at = empresa_filtro_capitalizada + '\uf8ff'

                networks_ref = db.collection('redes').where('empresa', '>=', start_at).where('empresa', '<=', end_at).stream()
            else:
                # Si no hay filtro, traer todas las redes
                networks_ref = db.collection('redes').stream()
        else:
            # Si es un usuario normal, solo ver las redes de su empresa
            networks_ref = db.collection('redes').where('empresa', '==', user_empresa).stream()

        # Convertimos las redes a una lista de diccionarios
        for network in networks_ref:
            network_data = network.to_dict()
            network_data['id'] = network.id
            networks.append(network_data)

        return jsonify(networks), 200

    except Exception as e:
        print(f"Error al obtener las redes: {e}")
        return jsonify({'error': 'Hubo un problema al obtener las redes.'}), 500

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

    user_id = session.get('user')  # Obtener el user_id de la sesión

    if not user_id:
        flash('Error: Usuario no encontrado en la sesión.', 'error')
        return jsonify({'message': 'Usuario no autenticado'}), 401

    try:
        # Obtener el documento del usuario desde la colección 'users'
        user_doc = db.collection('users').document(user_id).get()

        if not user_doc.exists:  # Aquí se corrigió el uso de exists
            return jsonify({'message': 'No se encontró el usuario en la base de datos'}), 404

        user_data = user_doc.to_dict()
        empresa = user_data.get('company')

        if not empresa:
            return jsonify({'message': 'No se encontró la empresa del usuario'}), 400

        # Calcular el monto aproximado en base al consumo mensual
        consumo_mensual = float(data.get('consumo_mensual'))
        monto_aprox = calcular_monto_aprox(consumo_mensual)

        # Crear el nuevo registro de la red con los datos enviados más el nombre de la empresa
        new_network = {
            'fecha_registro': data.get('fecha_registro'),
            'fecha_instalacion': data.get('fecha_instalacion'),
            'nro_medidor': data.get('nro_medidor'),
            'plano_instalacion': data.get('plano_instalacion'),
            'direccion': data.get('direccion'),
            'consumo_mensual': consumo_mensual,
            'monto_aprox': monto_aprox,  # Guardar el monto aproximado calculado
            'empresa': empresa  # Agregar el nombre de la empresa
        }

        db.collection('redes').add(new_network)
        return jsonify({'message': 'Red agregada con éxito'}), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error al agregar la red: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Hubo un problema al agregar la red.'}), 500


# Ruta para editar una red
@redes_bp.route('/redes/<id>', methods=['PUT'])
def update_network(id):
    data = request.get_json()

    try:
        # Asegurarse de convertir consumo_mensual a número
        consumo_mensual = float(data.get('consumo_mensual'))
        monto_aprox = calcular_monto_aprox(consumo_mensual)

        updated_network = {
            'fecha_registro': data.get('fecha_registro'),
            'fecha_instalacion': data.get('fecha_instalacion'),
            'nro_medidor': data.get('nro_medidor'),
            'plano_instalacion': data.get('plano_instalacion'),
            'direccion': data.get('direccion'),
            'consumo_mensual': consumo_mensual,
            'monto_aprox': monto_aprox
        }

        db.collection('redes').document(id).update(updated_network)
        return jsonify({'message': 'Red actualizada con éxito'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error al actualizar la red: {e}")
        return jsonify({'error': 'Hubo un problema al actualizar la red.'}), 500

# Ruta para eliminar una red
@redes_bp.route('/redes/<id>', methods=['DELETE'])
def delete_network(id):
    db.collection('redes').document(id).delete()
    return jsonify({'message': 'Red eliminada con éxito'}), 200

def calcular_monto_aprox(consumo_mensual):
    try:
        # Convertir consumo_mensual a float (o int si prefieres trabajar con enteros)
        consumo_mensual = float(consumo_mensual)
    except ValueError:
        raise ValueError("El consumo mensual debe ser un número válido.")
    
    monto = 0
    if consumo_mensual <= 20:
        monto = 22.529  # Cargo mínimo
    else:
        monto = 22.529

        if consumo_mensual > 20 and consumo_mensual <= 120:
            monto += (consumo_mensual - 20) * 1.019

        if consumo_mensual > 120 and consumo_mensual <= 300:
            monto += (120 - 20) * 1.019
            monto += (consumo_mensual - 120) * 1.155

        if consumo_mensual > 300:
            monto += (120 - 20) * 1.019
            monto += (300 - 120) * 1.155
            monto += (consumo_mensual - 300) * 1.649

    return round(monto, 2)

