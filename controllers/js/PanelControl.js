document.addEventListener('DOMContentLoaded', () => {
    const detailButtons = document.querySelectorAll('.btn.btn-primary.btn-sm');

    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que otros eventos de clic en la fila se disparen
            const row = button.closest('.network-row'); // Encuentra la fila que contiene el botón
            const networkId = row.getAttribute('data-network-id');
            const deviceRow = document.querySelector(`.device-row[data-parent-network="${networkId}"]`);

            if (deviceRow.style.display === 'none' || deviceRow.style.display === '') {
                deviceRow.style.display = 'table-row';
            } else {
                deviceRow.style.display = 'none';
            }
        });
    });
});
    