import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase con la clave de servicio
cred = credentials.Certificate('ruta/a/tu/clave/firebase.json')
firebase_admin.initialize_app(cred)

# Crear instancia de Firestore
db = firestore.client()
