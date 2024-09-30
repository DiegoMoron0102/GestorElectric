import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase Admin SDK
cred = credentials.Certificate('gestorelectric-5d20a-firebase-adminsdk-z48lc-10fa512203.json')
firebase_admin.initialize_app(cred)

# Inicializar Firestore
db = firestore.client()

# Leer documentos
mensajes_ref = db.collection('mensajes_soporte').stream()

for mensaje in mensajes_ref:
    print(f'{mensaje.id} => {mensaje.to_dict()}')
