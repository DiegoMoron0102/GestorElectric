function generarInforme() {
    const tipoInforme = document.getElementById('tipo-informe').value;

    const datos = {
        consumo: [120, 130, 140, 150, 160, 170],
        costos: [200, 220, 250, 300, 320, 350],
        eficiencia: [80, 85, 90, 88, 92, 95]
    };

    const etiquetas = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const ctx = document.getElementById('graficoInforme').getContext('2d');

    if (window.graficoGenerado) {
        window.graficoGenerado.destroy();
    }

    window.graficoGenerado = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: tipoInforme.charAt(0).toUpperCase() + tipoInforme.slice(1),
                data: datos[tipoInforme],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Informe de ${tipoInforme.charAt(0).toUpperCase() + tipoInforme.slice(1)}`
                }
            }
        }
    });
}
