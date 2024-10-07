import firebase_admin
from firebase_admin import credentials, firestore
import json

# Inicializar Firebase Admin SDK
cred = credentials.Certificate('gestorelectric-5d20a-firebase-adminsdk-z48lc-10fa512203.json')
firebase_admin.initialize_app(cred)

# Inicializar Firestore
db = firestore.client()

# Función para cargar el JSON desde una ruta y añadir los datos a Firestore
def cargar_json_a_firestore(ruta_json):
    try:
        # Abrir y cargar el archivo JSON
        with open(ruta_json, 'r') as archivo_json:
            datos = json.load(archivo_json)

        # Verificar si el JSON es una lista o un diccionario
        if isinstance(datos, list):
            # Si es una lista, iterar sobre cada objeto en la lista
            for dato in datos:
                if isinstance(dato, dict):
                    db.collection('redes').add(dato)
                else:
                    print("Error: Elemento de la lista no es un diccionario.")
        elif isinstance(datos, dict):
            # Si es un diccionario, agregarlo directamente
            db.collection('redes').add(datos)
        else:
            print("Error: El archivo JSON no es un diccionario ni una lista válida.")

        print(f"Datos añadidos correctamente desde {ruta_json}")

    except FileNotFoundError:
        print(f"Archivo JSON no encontrado en la ruta: {ruta_json}")
    except json.JSONDecodeError:
        print("Error al decodificar el archivo JSON. Verifica su formato.")
    except Exception as e:
        print(f"Error al añadir datos: {e}")

# Definir la ruta del archivo JSON en tu sistema (puedes cambiar esta ruta según tu archivo)
ruta_json = 'REDES_DATOS.json'

# Ejecutar la función para cargar el JSON
cargar_json_a_firestore(ruta_json)
