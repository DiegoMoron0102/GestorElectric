document.addEventListener('DOMContentLoaded', function() {
    // Modal para canjear código
    const modal = document.getElementById('redeem-code-modal');
    const redeemLink = document.getElementById('redeem-code-link');
    const closeModal = document.getElementsByClassName('close')[0];
    const redeemForm = document.getElementById('redeem-code-form');
    const redeemMessage = document.getElementById('redeem-message');

    // Mostrar el modal
    redeemLink.onclick = function() {
        modal.style.display = 'block';
    };

    // Cerrar el modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
        redeemMessage.innerHTML = '';  // Limpiar mensajes previos
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Enviar el código al backend para validación
    redeemForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const code = document.getElementById('redeem-code-input').value;

        fetch('/canjear_codigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo: code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                redeemMessage.innerHTML = `<p>¡Código canjeado con éxito! Producto: ${data.producto}</p>`;
            } else {
                redeemMessage.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
