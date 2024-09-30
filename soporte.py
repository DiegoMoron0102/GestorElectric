from flask import Blueprint, request, jsonify, render_template,redirect,url_for
from firebase_admin import firestore
from datetime import datetime

# Crear el Blueprint
soporte_bp = Blueprint('soporte_bp', __name__)

# Inicializar Firestore
db = firestore.client()

@soporte_bp.route('/admin/informe_seguridad')
def listar_mensajes():
    try:
        # Intentamos obtener los mensajes de soporte desde Firestore
        mensajes_ref = db.collection('mensajes_soporte').stream()
        lista_mensajes = []
        for mensaje in mensajes_ref:
            mensaje_data = mensaje.to_dict()

            # Verificamos que la fecha esté presente y sea un timestamp de Firestore
            if 'fecha' in mensaje_data:
                # Convertimos el timestamp de Firestore a un objeto datetime
                mensaje_data['fecha'] = mensaje_data['fecha'].strftime('%d/%m/%Y %H:%M')
            
            mensaje_data['id'] = mensaje.id  # Agrega el ID del documento a los datos
            lista_mensajes.append(mensaje_data)

        # Renderizamos la plantilla
        return render_template('F_admin/mensajes_soporte.html', mensajes=lista_mensajes)

    except Exception as e:
        # Agrega más detalles sobre el error al log
        print(f"Error al obtener los mensajes: {e}")  # Log para errores más detallado
        return f"Error al obtener los mensajes de soporte: {str(e)}", 500


        

# Ruta para enviar un nuevo mensaje de soporte
@soporte_bp.route('/soporte/enviar', methods=['POST'])
def enviar_mensaje():
    nombre = request.form.get('nombre')
    email = request.form.get('email')
    mensaje = request.form.get('mensaje')

    try:
        # Agregar el mensaje a la colección de Firestore
        db.collection('mensajes_soporte').add({
            'nombre': nombre,
            'email': email,
            'mensaje': mensaje,
            'fecha': datetime.now()
        })

        # Redirigir al usuario a la página principal (home) con un mensaje de éxito
        return redirect(url_for('home'))  # Redirige a la ruta que apunta al 'home'
    
    except Exception as e:
        # En caso de error, redirigir a una página de error o mostrar un mensaje
        return render_template('error.html', error=str(e))  # Muestra una página de error
