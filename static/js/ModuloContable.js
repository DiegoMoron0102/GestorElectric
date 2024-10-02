let transactions = [];
let editingIndex = -1; // Variable para controlar la edición de una transacción
let chartInstance = null; // Para controlar la instancia del gráfico

const modal = document.getElementById('transaction-modal');
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const confirmEditModal = document.getElementById('confirm-edit-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeBtns = document.querySelectorAll('.close-btn');
const transactionForm = document.getElementById('transaction-form');
const transactionsTable = document.querySelector('#transactions-table tbody');
const totalBalanceEl = document.getElementById('total-balance');
const totalIngresosEl = document.getElementById('total-ingresos');
const totalGastosEl = document.getElementById('total-gastos');
const submitBtn = document.getElementById('submit-btn');
const modalTitle = document.getElementById('modal-title');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const confirmEditBtn = document.getElementById('confirm-edit-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let deleteIndex = -1; // Variable para eliminar transacción

// Evento para abrir el modal
addTransactionBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Añadir Transacción';
    submitBtn.textContent = 'Añadir';
    transactionForm.reset();
    editingIndex = -1; // Reiniciar índice de edición
    modal.style.display = 'block';
});

// Evento para cerrar modales
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.style.display = 'none';
        confirmDeleteModal.style.display = 'none';
        confirmEditModal.style.display = 'none';
    });
});

// Función para agregar o editar una transacción
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const descripcion = document.getElementById('descripcion').value;
    const fecha = document.getElementById('fecha').value;

    if (!isNaN(monto) && monto > 0) {
        const transaction = { tipo, monto, descripcion, fecha };

        if (editingIndex >= 0) {
            // Editar transacción existente
            transactions[editingIndex] = transaction;
            confirmEditModal.style.display = 'block'; // Mostrar confirmación
        } else {
            // Añadir nueva transacción
            transactions.push(transaction);
            modal.style.display = 'none'; // Cerrar modal
            actualizarTabla();
            actualizarResumen();
        }
    }
});

// Función para actualizar la tabla
function actualizarTabla() {
    transactionsTable.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.fecha}</td>
            <td>${transaction.descripcion}</td>
            <td>${transaction.tipo}</td>
            <td>${transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toFixed(2)}Bs</td>
            <td>
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        transactionsTable.appendChild(row);
    });

    // Asignar eventos a botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editarTransaccion);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            deleteIndex = event.target.dataset.index;
            confirmDeleteModal.style.display = 'block';
        });
    });
}

// Función para actualizar el resumen contable
function actualizarResumen() {
    const totalIngresos = transactions
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

    const totalGastos = transactions
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);

    const balance = totalIngresos - totalGastos;

    totalBalanceEl.textContent = balance.toFixed(2);
    totalIngresosEl.textContent = totalIngresos.toFixed(2);
    totalGastosEl.textContent = totalGastos.toFixed(2);

    actualizarGrafico(totalIngresos, totalGastos);
}

// Función para eliminar una transacción
confirmDeleteBtn.addEventListener('click', () => {
    transactions.splice(deleteIndex, 1);
    confirmDeleteModal.style.display = 'none';
    actualizarTabla();
    actualizarResumen();
});

// Cancelar la eliminación
cancelDeleteBtn.addEventListener('click', () => {
    confirmDeleteModal.style.display = 'none';
});

// Función para editar una transacción
function editarTransaccion(event) {
    const index = event.target.dataset.index;
    const transaction = transactions[index];

    document.getElementById('tipo').value = transaction.tipo;
    document.getElementById('monto').value = transaction.monto;
    document.getElementById('descripcion').value = transaction.descripcion;
    document.getElementById('fecha').value = transaction.fecha;

    modalTitle.textContent = 'Editar Transacción';
    submitBtn.textContent = 'Aceptar Edición';
    modal.style.display = 'block';
    editingIndex = index;
}

// Confirmar la edición de una transacción
confirmEditBtn.addEventListener('click', () => {
    confirmEditModal.style.display = 'none';
    modal.style.display = 'none';
    actualizarTabla();
    actualizarResumen();
});

// Cancelar la edición
cancelEditBtn.addEventListener('click', () => {
    confirmEditModal.style.display = 'none';
});

// Función para actualizar el gráfico
function actualizarGrafico(ingresos, gastos) {
    const ctx = document.getElementById('chart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy(); // Destruir gráfico existente antes de actualizar
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                label: 'Resumen contable',
                data: [ingresos, gastos],
                backgroundColor: ['#4CAF50', '#FF6347']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para filtrar por fecha
document.getElementById('filter-btn').addEventListener('click', () => {
    const startDate = document.getElementById('filter-start').value;
    const endDate = document.getElementById('filter-end').value;

    const filteredTransactions = transactions.filter(t => {
        return (!startDate || t.fecha >= startDate) && (!endDate || t.fecha <= endDate);
    });

    transactionsTable.innerHTML = '';
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.fecha}</td>
            <td>${transaction.descripcion}</td>
            <td>${transaction.tipo}</td>
            <td>${transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toFixed(2)}Bs</td>
        `;
        transactionsTable.appendChild(row);
    });
});
