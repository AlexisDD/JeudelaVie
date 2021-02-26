var statsGraph;
var ctxGraph = document.getElementById('graph').getContext('2d');
var dataValues = [];
var dataIndices;
updateIndices();

var config = {
    type: 'line',
    data: {
        datasets: [{
            label: "Nombre de cellules vivantes",
            data: dataValues,
            lineColor: "red",
            fill:false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
        }],
        labels: dataIndices,

    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
}
drawGraph(dataValues);
function drawGraph(listeNbCellules){
    dataValues=listeNbCellules;
    statsGraph = new Chart(ctxGraph, config);
}

function updateIndices(){
    dataIndices = Array(dataValues.length);
    let i=0;
    while(i<dataValues.length) dataIndices[i++]=i;
}

function updateData(data){
    dataValues = data;
    updateIndices();
    statsGraph.data.datasets[0].data = dataValues;
    statsGraph.data.labels = dataIndices;
    statsGraph.update();
}