import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase Admin SDK
cred = credentials.Certificate('gestorelectric-5d20a-firebase-adminsdk-z48lc-10fa512203.json')
firebase_admin.initialize_app(cred)

# Inicializar Firestore
db = firestore.client()

# Datos a agregar
nuevos_datos = [
    {
        'consumo_mensual': '123',
        'direccion': 'asds1',
        'fecha_instalacion': '2024-10-19',
        'fecha_registro': '2024-10-17',
        'monto_aprox': '13',
        'nro_medidor': 'med001',
        'plano_instalacion': 'plano001'
    },
    {
        'consumo_mensual': '124',
        'direccion': 'asds2',
        'fecha_instalacion': '2024-10-19',
        'fecha_registro': '2024-10-17',
        'monto_aprox': '14',
        'nro_medidor': 'med002',
        'plano_instalacion': 'plano002'
    },
    {
        'consumo_mensual': '125',
        'direccion': 'asds3',
        'fecha_instalacion': '2024-10-19',
        'fecha_registro': '2024-10-17',
        'monto_aprox': '15',
        'nro_medidor': 'med003',
        'plano_instalacion': 'plano003'
    },
    # Añade 7 más datos similares aquí
]

# Añadir datos a la colección 'redes'
for dato in nuevos_datos:
    db.collection('redes').add(dato)

print("Datos agregados exitosamente.")
