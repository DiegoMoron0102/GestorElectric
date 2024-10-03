document.addEventListener('DOMContentLoaded', function () {
    fetch('/informes_datos')
        .then(response => response.json())
        .then(data => {
            if (data.redes) {
                generarGraficos(data.redes);
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
        // Aquí puedes agregar más gráficos similares utilizando los datos de "redesData"
        const ctxPeakConsumption = document.getElementById('peakConsumptionChart').getContext('2d');
        // Datos ficticios para los picos de consumo, ajusta según los datos reales.
        const peakConsumptionData = [150, 180, 130, 120];
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
                        title: {
                            display: true,
                            text: 'Potencia en kW'
                        },
                        beginAtZero: true
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Redes Eléctricas'
                        }
                    }
                }
            }
        });
        const ctxEnergyEfficiency = document.getElementById('energyEfficiencyChart').getContext('2d');
        // Datos ficticios de eficiencia energética, ajusta según los datos reales.
        const efficiencyData = [85, 90, 75, 88]; // Valores en porcentaje (%)
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
                        title: {
                            display: true,
                            text: 'Porcentaje (%)'
                        },
                        beginAtZero: true,
                        max: 100
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Redes Eléctricas'
                        }
                    }
                }
            }
        });
                
    }

    // Lógica para descargar como PDF
    const downloadButton = document.getElementById('download-pdf');
    downloadButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Informe de Redes de Clientes", 10, 10);
        doc.save("informe_redes.pdf");
    });
});
