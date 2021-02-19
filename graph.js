var ctx = document.getElementById('graph').getContext('2d');
var dataValues = [0,1,2,3,4,2,6,8,9,1];
var dataIndices;
updateIndices();

var config = {
    type: 'line',
    data: {
        datasets: [{
            label: "Statistiques nb cellules vivantes/nb itérations",
            data: dataValues
        }],
        labels: dataIndices
    },
    options: {
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
}
drawGraph(dataValues)
function drawGraph(listeNbCellules){
    dataValues=listeNbCellules;
    var graph = new Chart(ctx, config);
}

function updateIndices(){
    dataIndices = Array(dataValues.length);
    let i=0;
    while(i<dataValues.length) dataIndices[i++]=i;
}