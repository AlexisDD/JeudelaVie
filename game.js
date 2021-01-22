var width = 600;
var height = 700;
var cellSize = 20;
var isActive = false;

var gridLength = width / cellSize;
var gridHeight = height / cellSize;

var c = document.getElementById("grille");
var  taux_remplissage = document.getElementById("taux_remplissage");
var ctx = c.getContext("2d");
var grid = new Array(gridLength);

c.width=width;
c.height=height;

ctx.beginPath();
for (var x = 0; x < gridLength; x += 1) {
    for (var y = 0; y < gridHeight; y += 1) {
        ctx.rect(x * cellSize, y*cellSize, cellSize, cellSize);
    }
}
ctx.stroke();

c.addEventListener('click', function(event) {
    var x = Math.floor(event.offsetX / cellSize);
    var y = Math.floor(event.offsetY / cellSize);
    console.log("X:"+x+" Y: "+ y);
    console.log(grid[x][y]);
    if (grid[x][y].statut==1)
        grid[x][y].statut=0;
    else
        grid[x][y].statut=1;    
    console.log(grid[x][y]);
 }, false);



 function init_grid(alea=0){
    for (var x = 0; x < gridLength; x += 1) {
        grid[x] = new Array(gridHeight); 
        for (var y = 0; y < gridHeight; y += 1) {
            if (Math.random()<=alea){
                grid[x][y]=new Cellule(1,x,y);
                grid[x][y].tempsVie=1;
            }else{
                grid[x][y]=new Cellule(0,x,y);

            }
        }
    }
}




 class Cellule {
     /** Pour définir une nouvelle cellule : 
      * const cellule = new Cellule(statut) avec statut = 1/0 ou true/false.
      **/
    constructor(statut,x,y) {
      this._statut = statut;
      this._tempsVie = 0;
      this._x = x;
      this._y = y;      
      this.dessiner();
    }
  
    get statut() {
        return this._statut;
    }
  
    set statut(value) {
        if(value == 1)
            this.augmenterTempsVie();
        else
            this._tempsVie = 0;
        this._statut = value;
        this.dessiner();
    }

    get tempsVie() {
        return this._tempsVie;
    }

    set tempsVie(value){
        this._tempsVie = value;
        this.dessiner();
    }

    augmenterTempsVie(){
        this._tempsVie++;
        this.dessiner();
    }
    dessiner() {
       ctx.clearRect(this._x * cellSize, this._y*cellSize, cellSize, cellSize);  
       if (this._statut!=0){
            /*        
            if (this._tempsVie==1)                
                ctx.fillStyle = 'rgba(190, 190, 190)';            
            else if (this._tempsVie==2)                
            ctx.fillStyle = 'rgba(133, 1333, 133)'; 
            else if (this._tempsVie==3)                
                ctx.fillStyle = 'rgba(79, 79, 79)'; 
            else               */
            ctx.fillStyle = 'rgba(0, 0, 0, ' + this._tempsVie / 4 + ')'; 

            ctx.fillRect(this._x * cellSize, this._y*cellSize, cellSize, cellSize); 
        }
        ctx.stroke();    
    }
  }
