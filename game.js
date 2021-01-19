var gridSize = 600;
var cellSize = 20;

var gridLength = 600 / cellSize;

var c = document.getElementById("grille");
var ctx = c.getContext("2d");

ctx.beginPath();
for (var x = 0; x < gridLength; x += 1) {
    for (var y = 0; y < gridLength; y += 1) {
        ctx.rect(x * cellSize, y*cellSize, cellSize, cellSize);
    }
}
ctx.stroke();


c.addEventListener('click', function(event) {
    var x = Math.floor(event.offsetX / cellSize);
    var y = Math.floor(event.offsetY / cellSize);
    console.log("X:"+x+" Y: "+ y);
 }, false);