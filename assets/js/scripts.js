var chart;

document.getElementById('convert').addEventListener('click', function() {
    var amount = document.getElementById('amount').value;
    var currency = document.getElementById('currency').value;

    // Muestra los tres puntos mientras se realiza la consulta para luego cambiarlo
    document.getElementById('result').innerText = '...';

    fetch(`https://mindicador.cl/api/${currency}`)
        .then(response => response.json())
        .then(data => {
            var result = amount / data.serie[0].valor;
            document.getElementById('result').innerText = 'Resultado: $' + result.toFixed(2);

            // Muestra el contenedor del gráfico
            document.getElementById('chartContainer').style.display = 'block';

            // Destruye el gráfico existente
            if (chart) {
                chart.destroy();
            }

            // Generar el gráfico con los últimos 10 días de datos
            var ctx = document.getElementById('myChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.serie.slice(0, 10).map(item => new Date(item.fecha).toLocaleDateString()),
                    datasets: [{
                        label: 'Valor de la moneda',
                        data: data.serie.slice(0, 10).map(item => item.valor),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        })
        .catch(error => {
            document.getElementById('result').innerText = 'Error: ' + error;
        });
});