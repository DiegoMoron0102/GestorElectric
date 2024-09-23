import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase con la clave de servicio
cred = credentials.Certificate('C:\Users\diego\Downloads\gestorelectric-5d20a-firebase-adminsdk-z48lc-ed2f2ef1b5.json')
firebase_admin.initialize_app(cred)

# Crear instancia de Firestore
db = firestore.client()
