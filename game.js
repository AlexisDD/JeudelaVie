var width = 700;
var height = 600;
var cellSize = 20;
var isActive = false;

var gridLength = width / cellSize;
var gridHeight = height / cellSize;

var c = document.getElementById("grille");
var tauxRemplissage = document.getElementById("taux_remplissage");
var vitesse = document.getElementById("vitesse");

var delay = 1;
var timer;
var nbIterations = 0;
var nbCellulesVivantes = 0;

var ctx = c.getContext("2d");
var grid = new Array(gridLength);

c.width=width;
c.height=height;

initGrid();

/////////////////////////////////////////////

// Demander à l'utilisateur de mettre en pause
// avant qu'il ne clique sur une case

////////////////////////////////////////////


c.addEventListener('click', function(event) {
    if (isActive){
        playPause();
        clearTimeout(timer);
    }        
    ajoutManuel(event);
}, false);

function ajoutManuel(event){
    var x = Math.floor(event.offsetX / cellSize);
    var y = Math.floor(event.offsetY / cellSize);
    const cellule = grid[x][y];
    if (cellule.statut==1){
        cellule.statut=0;
        nbCellulesVivantes--;
    } else {
        cellule.statut=1;
        nbCellulesVivantes++;
    }
    updateStats();
}

function initGrid(){
    ctx.beginPath();
    for (var x = 0; x < gridLength; x += 1){        
        grid[x] = new Array(gridHeight); 
        for (var y = 0; y < gridHeight; y += 1){
            ctx.rect(x * cellSize, y*cellSize, cellSize, cellSize);            
            grid[x][y]=new Cellule(x,y,0);
        }
    }
    ctx.stroke();
 }

function randomFill(alea = 0.3){
    var nb = 0;
    for (var x = 0; x < gridLength; x += 1) {
        grid[x] = new Array(gridHeight); 
        for (var y = 0; y < gridHeight; y += 1) {
            if (Math.random() <= alea){
                grid[x][y]=new Cellule(x,y,1);
                nb++;
            } else
                grid[x][y]=new Cellule(x,y,0);
        }
    }    
    nbIterations = 0;
    nbCellulesVivantes = nb;
    updateStats();
}

function nbCellulesAutour(x,y){
    // fonction qui renvoie le nombre de voisins vivants d'une cellule
    // fonction à revoir pour le système de carré dont les côtés se rejoignent
    var nbVivantProche = 0;
    for (let posX = x-1; posX < x+2; posX++) {
        for (let posY = y-1; posY < y+2; posY++){
            if ((posX == x && posY == y) 
            || !(0 <= posY && posY < gridHeight)
            || !(0 <= posX && posX < gridLength))
                continue
            if (grid[posX][posY].statut == 1)
                nbVivantProche += 1
        }
    }
    return nbVivantProche;
}

function game(){
    // la fonction de mise à jour de la grille avec les règles
    const statut_next = grid.map(array => array.map(cellule => cellule.statut));

    for (x = 0; x < gridLength; x++){
		for (y = 0; y < gridHeight; y++){
            var nb = nbCellulesAutour(x,y);
            //règle 2 ignorée car pas de changement de statut
            if (nb == 3)
                statut_next[x][y]=1;
            else if (nb < 2 || nb > 3)
                statut_next[x][y]=0;
        }
    }

    var nbVivants = 0;
    statut_next.forEach(function (array, x) {
        array.forEach(function(statut, y){
            if(statut == 1)
                nbVivants++;
            grid[x][y].statut = statut;
        });
    });

    nbIterations++;
    nbCellulesVivantes = nbVivants;
    updateStats();

    if (isActive){
        temps=vitesse.value;
        if (temps!=0){
            if (temps<=1)
                delay=1000/temps; // A Vitesse x0.1 : 10 secondes
            else // A Vitesse x1 : 1 seconde
                delay=1000/(temps**(4.3));   // A Vitesse x2 : 50 ms
            timer = setTimeout(game, delay); // A Vitesse x0.1 : 10 secondes
        } else {
            playPause();
        }
    }
}
