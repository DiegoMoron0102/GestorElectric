document.addEventListener('DOMContentLoaded', () => {
    const networkRows = document.querySelectorAll('.network-row');

    networkRows.forEach(row => {
        row.addEventListener('click', () => {
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