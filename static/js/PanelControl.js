// Inicializar Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",  // Asegúrate de usar tus credenciales correctas aquí
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para obtener los datos de Firestore y mostrarlos en la tabla
function getNetworks() {
    db.collection("redes").get().then((querySnapshot) => {
        let tableBody = document.getElementById("network-table");
        tableBody.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${doc.id}</td>
                    <td>${data.fecha_registro}</td>
                    <td>${data.fecha_instalacion}</td>
                    <td>${data.nro_medidor}</td>
                    <td>${data.plano_instalacion}</td>
                    <td>${data.direccion}</td>
                    <td>${data.consumo_mensual}</td>
                    <td>${data.monto_aprox}</td>
                    <td>
                        <button class="btn btn-info" onclick="editNetwork('${doc.id}')">Editar</button>
                        <button class="btn btn-danger" onclick="deleteNetwork('${doc.id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    });
}

// Función para mostrar el formulario para agregar una nueva red
function showAddForm() {
    document.getElementById("network-form").style.display = "block";
    // Limpiar el formulario para agregar un nuevo registro
    document.getElementById('id').value = '';
    document.getElementById('fecha_registro').value = '';
    document.getElementById('fecha_instalacion').value = '';
    document.getElementById('nro_medidor').value = '';
    document.getElementById('plano_instalacion').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('consumo_mensual').value = '';
    document.getElementById('monto_aprox').value = '';
}

// Función para agregar una nueva red
function addNetwork() {
    const id = document.getElementById('id').value;
    const fecha_registro = document.getElementById('fecha_registro').value;
    const fecha_instalacion = document.getElementById('fecha_instalacion').value;
    const nro_medidor = document.getElementById('nro_medidor').value;
    const plano_instalacion = document.getElementById('plano_instalacion').value;
    const direccion = document.getElementById('direccion').value;
    const consumo_mensual = document.getElementById('consumo_mensual').value;
    const monto_aprox = document.getElementById('monto_aprox').value;

    console.log({ id, fecha_registro, fecha_instalacion, nro_medidor, plano_instalacion, direccion, consumo_mensual, monto_aprox }); // Depuración

    db.collection("redes").doc(id).set({
        fecha_registro,
        fecha_instalacion,
        nro_medidor,
        plano_instalacion,
        direccion,
        consumo_mensual,
        monto_aprox
    }).then(() => {
        alert("Red agregada con éxito");
        getNetworks();  // Refrescar los datos en la tabla
    }).catch((error) => {
        console.error("Error al agregar red: ", error);
    });
}

// Función para editar una red existente
function editNetwork(id) {
    db.collection("redes").doc(id).get().then((doc) => {
        if (doc.exists) {
            document.getElementById('id').value = doc.id;
            document.getElementById('fecha_registro').value = doc.data().fecha_registro;
            document.getElementById('fecha_instalacion').value = doc.data().fecha_instalacion;
            document.getElementById('nro_medidor').value = doc.data().nro_medidor;
            document.getElementById('plano_instalacion').value = doc.data().plano_instalacion;
            document.getElementById('direccion').value = doc.data().direccion;
            document.getElementById('consumo_mensual').value = doc.data().consumo_mensual;
            document.getElementById('monto_aprox').value = doc.data().monto_aprox;

            // Mostrar formulario para editar
            document.getElementById("network-form").style.display = "block";
        }
    });
}

// Función para actualizar una red
function updateNetwork() {
    const id = document.getElementById('id').value;
    const fecha_registro = document.getElementById('fecha_registro').value;
    const fecha_instalacion = document.getElementById('fecha_instalacion').value;
    const nro_medidor = document.getElementById('nro_medidor').value;
    const plano_instalacion = document.getElementById('plano_instalacion').value;
    const direccion = document.getElementById('direccion').value;
    const consumo_mensual = document.getElementById('consumo_mensual').value;
    const monto_aprox = document.getElementById('monto_aprox').value;

    db.collection("redes").doc(id).update({
        fecha_registro,
        fecha_instalacion,
        nro_medidor,
        plano_instalacion,
        direccion,
        consumo_mensual,
        monto_aprox
    }).then(() => {
        alert("Red actualizada con éxito");
        getNetworks();  // Refrescar los datos en la tabla
    }).catch((error) => {
        console.error("Error al actualizar red: ", error);
    });
}

// Función para eliminar una red
function deleteNetwork(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta red?")) {
        db.collection("redes").doc(id).delete().then(() => {
            alert("Red eliminada con éxito");
            getNetworks();  // Refrescar los datos en la tabla
        }).catch((error) => {
            console.error("Error al eliminar red: ", error);
        });
    }
}

// Cargar los datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', getNetworks);
