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
# Ruta para agregar un nuevo producto al inventario
@inventario_bp.route('/inventario', methods=['POST'])
def agregar_producto():
    data = request.get_json()
    
    # Calcular el monto total basado en cantidad y precio
    cantidad = data.get('cantidad', 1)
    precio = data.get('precio', 0.0)  # Nuevo campo de precio
    monto_total = cantidad * precio

    # Crear el nuevo producto
    nuevo_producto = {
        'nombre': data.get('nombre'),
        'capacidad': data.get('capacidad'),
        'descripcion': data.get('descripcion'),
        'imagen': data.get('imagen'),
        'categoria': data.get('categoria'),
        'cantidad': cantidad,
        'precio': precio  # Guardar el precio en la colección inventario
    }
    db.collection('inventario').add(nuevo_producto)

    # Registrar el monto total como gasto en la colección de contabilidad con formato correcto
    nuevo_gasto = {
        'descripcion': f"Compra de {cantidad} unidades de {data.get('nombre')}",
        'monto': monto_total,
        'fecha': firestore.SERVER_TIMESTAMP,  # Registrar la fecha del servidor
        'tipo': 'gasto'  # Especificar que es un gasto
    }
    db.collection('contabilidad').add(nuevo_gasto)

    return jsonify({"mensaje": "Producto agregado con éxito"}), 201

# Ruta para editar un producto
@inventario_bp.route('/inventario/<id>', methods=['PUT'])
def editar_producto(id):
    data = request.get_json()
    
    # Obtener los datos actuales del producto antes de la actualización
    producto_ref = db.collection('inventario').document(id)
    producto = producto_ref.get().to_dict()

    # Actualizar la información del producto
    producto_ref.update(data)

    # Si se actualizan cantidad o precio, recalcular el monto total y registrar el cambio en contabilidad
    cantidad_nueva = data.get('cantidad', producto['cantidad'])  # Usar el valor actualizado si existe
    precio_nuevo = data.get('precio', producto['precio'])  # Usar el valor actualizado si existe
    monto_total = cantidad_nueva * precio_nuevo

    nuevo_gasto = {
        'descripcion': f"Actualización de {producto['nombre']}",
        'monto': monto_total,
        'fecha': firestore.SERVER_TIMESTAMP,  # Registrar la fecha actual
        'tipo': 'gasto'  # Especificar que es un gasto
    }
    db.collection('contabilidad').add(nuevo_gasto)

    return jsonify({"mensaje": "Producto actualizado con éxito"}), 200


# Ruta para eliminar un producto
@inventario_bp.route('/inventario/<id>', methods=['DELETE'])
def eliminar_producto(id):
    db.collection('inventario').document(id).delete()
    return jsonify({"mensaje": "Producto eliminado con éxito"}), 200
