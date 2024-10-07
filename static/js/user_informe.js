document.addEventListener('DOMContentLoaded', function () {
    fetch('/informes_datos')
        .then(response => response.json())
        .then(data => {
            if (data.redes) {
                generarGraficos(data.redes);
                generarTablaDatos(data.redes);
            } else {
                console.error('No se pudieron obtener los datos.');
            }
        })
        .catch(error => console.error('Error al obtener los datos:', error));

    function generarGraficos(redesData) {
        // Gráfico de Consumo de Energía por Cliente
        const energyConsumptionData = redesData.map(red => red.consumo_mensual);
        const labels = redesData.map(red => red.direccion);

        const ctxEnergyConsumption = document.getElementById('energyConsumptionChart').getContext('2d');
        new Chart(ctxEnergyConsumption, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Consumo Mensual (kWh)',
                    data: energyConsumptionData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Gráfico de Picos de Consumo
        const ctxPeakConsumption = document.getElementById('peakConsumptionChart').getContext('2d');
        const peakConsumptionData = [150, 180, 130, 120];  // Datos ficticios
        const peakLabels = ['Red A', 'Red B', 'Red C', 'Red D'];

        new Chart(ctxPeakConsumption, {
            type: 'line',
            data: {
                labels: peakLabels,
                datasets: [{
                    label: 'Picos de Consumo (kW)',
                    data: peakConsumptionData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Gráfico de Eficiencia Energética
        const ctxEnergyEfficiency = document.getElementById('energyEfficiencyChart').getContext('2d');
        const efficiencyData = [85, 90, 75, 88];
        const efficiencyLabels = ['Red A', 'Red B', 'Red C', 'Red D'];

        new Chart(ctxEnergyEfficiency, {
            type: 'bar',
            data: {
                labels: efficiencyLabels,
                datasets: [{
                    label: 'Eficiencia Energética (%)',
                    data: efficiencyData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Generar la tabla de datos para el informe
    function generarTablaDatos(redesData) {
        const tablaHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Dirección</th>
                        <th>Empresa</th>
                        <th>Consumo Mensual (kWh)</th>
                        <th>Monto Aproximado</th>
                        <th>Fecha de Instalación</th>
                        <th>Número de Medidor</th>
                        <th>Plano de Instalación</th>
                    </tr>
                </thead>
                <tbody>
                    ${redesData.map(red => `
                        <tr>
                            <td>${red.direccion}</td>
                            <td>${red.empresa}</td>
                            <td>${red.consumo_mensual}</td>
                            <td>${red.monto_aprox}</td>
                            <td>${red.fecha_instalacion}</td>
                            <td>${red.nro_medidor}</td>
                            <td>${red.plano_instalacion}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('tablaDatos').innerHTML = tablaHTML;
    }

    // Descargar como PDF
    const downloadButton = document.getElementById('download-pdf');
    downloadButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const fecha = new Date().toLocaleDateString();

        doc.text(`Informe de Redes de Clientes (${fecha})`, 10, 10);
        // Capturando los gráficos y agregándolos al PDF
        doc.addImage(document.getElementById('energyConsumptionChart').toDataURL(), 'PNG', 10, 20, 180, 60);
        doc.addImage(document.getElementById('peakConsumptionChart').toDataURL(), 'PNG', 10, 90, 180, 60);
        doc.addImage(document.getElementById('energyEfficiencyChart').toDataURL(), 'PNG', 10, 160, 180, 60);

        doc.save(`informe_redes_${fecha}.pdf`);
    });
});
