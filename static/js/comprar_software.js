document.addEventListener("DOMContentLoaded", () => {
    const purchaseForm = document.getElementById("purchase-form");

    purchaseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener el NoSerie desde el campo oculto en el formulario
        const noSerie = document.getElementById("software-no-serie").value;
        const metodoPago = document.getElementById("metodo_pago").value;

        if (!metodoPago) {
            alert("Por favor selecciona un método de pago.");
            return;
        }

        const purchaseData = {
            metodo_pago: metodoPago,
        };

        console.log("Software NoSerie:", noSerie);
        console.log("Método de Pago:", metodoPago);

        // Realizamos la compra usando el método POST
        fetch(`/user/comprar_software/${noSerie}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(purchaseData)
        })
        
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la compra");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = `/user/compra_exitosa/${data.codigo_compra}`;
            } else {
                alert('Hubo un problema con la compra.');
            }
        })
        .catch(error => {
            console.error('Error al procesar la compra:', error);
            alert('Error al procesar la compra. Intenta nuevamente.');
        });
    });
});
