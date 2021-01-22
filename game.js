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


 class Cellule {
     /** Pour définir une nouvelle cellule : 
      * const cellule = new Cellule(statut) avec statut = 1/0 ou true/false.
      **/
    constructor(statut) {
      this.statut = statut;
      this.tempsVie = 0;
    }
  
    get statut() {
        return this.statut;
    }
  
    set statut(value) {
        if(value == 1)
            this.augmenterTempsVie();
        else
            this.tempsVie = 0;
        this.statut = value;
    }

    get tempsVie() {
        return this.tempsVie;
    }

    set tempsVie(value){
        this.tempsVie =value;
    }

    augmenterTempsVie(){
        this.tempsVie++;
    }

    static dessiner(tableauCellules) {
        // Dessiner les cellules ici ? appeler avec Cellule.dessiner(tableauCellules)
    }
  }