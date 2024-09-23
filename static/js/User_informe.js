document.addEventListener('DOMContentLoaded', function () {
    const { jsPDF } = window.jspdf;

    // Gráfico de Consumo de Energía por Cliente
    const ctx1 = document.getElementById('energyConsumptionChart').getContext('2d');
    const energyConsumptionChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D'],
            datasets: [{
                label: 'Consumo (kWh)',
                data: [1200, 1900, 3000, 1500],
                backgroundColor: '#1DB954',
                borderColor: '#1DB954',
                borderWidth: 1
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

    // Gráfico de Picos de Consumo
    const ctx2 = document.getElementById('peakConsumptionChart').getContext('2d');
    const peakConsumptionChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Pico de Consumo (kWh)',
                data: [3000, 4500, 2500, 6000, 3500, 5000],
                borderColor: '#1DB954',
                fill: false,
                tension: 0.1
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

    // Gráfico de Eficiencia Energética
    const ctx3 = document.getElementById('energyEfficiencyChart').getContext('2d');
    const energyEfficiencyChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Eficiente', 'Ineficiente'],
            datasets: [{
                label: 'Eficiencia Energética',
                data: [75, 25],
                backgroundColor: ['#1DB954', '#ff6384'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true
        }
    });

    // Descargar como PDF
    document.getElementById('download-pdf').addEventListener('click', function () {
        const doc = new jsPDF();
        doc.text('Informes de Redes de Clientes', 10, 10);
        doc.addPage();

        // Captura de gráficos y exportación a PDF
        const chartImages = [
            { id: 'energyConsumptionChart', description: 'Gráfico de Consumo de Energía por Cliente.' },
            { id: 'peakConsumptionChart', description: 'Gráfico de Picos de Consumo.' },
            { id: 'energyEfficiencyChart', description: 'Gráfico de Eficiencia Energética.' }
        ];

        let yPosition = 20;
        chartImages.forEach(chart => {
            const canvas = document.getElementById(chart.id);
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, yPosition, 190, 100);
            yPosition += 110; // Espacio entre gráficos
            doc.text(chart.description, 10, yPosition);
            yPosition += 10; // Espacio después de la descripción
            doc.addPage();
        });

        doc.save('informes_redes.pdf');
    });
});
