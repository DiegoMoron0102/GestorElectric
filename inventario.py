from flask import Blueprint, request, jsonify
from firebase_admin import firestore

# Crear el Blueprint
inventario_bp = Blueprint('inventario_bp', __name__)

# Inicializar Firestore
db = firestore.client()

# Ruta para obtener todos los productos del inventario
@inventario_bp.route('/inventario', methods=['GET'])
def obtener_productos():
    productos_ref = db.collection('inventario').stream()
    productos = []
    for producto in productos_ref:
        data = producto.to_dict()
        data['id'] = producto.id
        productos.append(data)
    return jsonify(productos)

# Ruta para agregar un nuevo producto al inventario
@inventario_bp.route('/inventario', methods=['POST'])
def agregar_producto():
    data = request.get_json()
    nuevo_producto = {
        'nombre': data.get('nombre'),
        'capacidad': data.get('capacidad'),
        'descripcion': data.get('descripcion'),
        'imagen': data.get('imagen'),
        'categoria': data.get('categoria'),
        'cantidad': data.get('cantidad', 1)  # Por defecto, 1 unidad
    }
    db.collection('inventario').add(nuevo_producto)
    return jsonify({"mensaje": "Producto agregado con éxito"}), 201

# Ruta para editar un producto
@inventario_bp.route('/inventario/<id>', methods=['PUT'])
def editar_producto(id):
    data = request.get_json()
    db.collection('inventario').document(id).update(data)
    return jsonify({"mensaje": "Producto actualizado con éxito"}), 200

# Ruta para eliminar un producto
@inventario_bp.route('/inventario/<id>', methods=['DELETE'])
def eliminar_producto(id):
    db.collection('inventario').document(id).delete()
    return jsonify({"mensaje": "Producto eliminado con éxito"}), 200
