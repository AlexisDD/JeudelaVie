var width = 700;
var height = 600;
var cellSize = 20;
var isActive = false;

var gridLength = width / cellSize;
var gridHeight = height / cellSize;

var c = document.getElementById("grille");
var tauxRemplissage = document.getElementById("taux_remplissage");
var vitesse = document.getElementById("vitesse");
var button_play = document.getElementById("button_play");

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
        playPause(button_play);
        setTimeout(function(){ ajout_manuel(event); }, timeout);
    }else{
        ajout_manuel(event);
    }
}, false);

function ajout_manuel(event){
    var x = Math.floor(event.offsetX / cellSize);
    var y = Math.floor(event.offsetY / cellSize);
    console.log("X:"+x+" Y: "+ y);
    console.log(grid[x][y]);
    if (grid[x][y].statut==1)
        grid[x][y].statut=0;
    else
        grid[x][y].statut=1;
    console.log(grid[x][y]);
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

function randomFill(alea){
    if (typeof alea == 'undefined')
        alea=0;
    for (var x = 0; x < gridLength; x += 1) {
        grid[x] = new Array(gridHeight); 
        for (var y = 0; y < gridHeight; y += 1) {
            if (Math.random() <= alea)
                grid[x][y]=new Cellule(x,y,1);
            else
                grid[x][y]=new Cellule(x,y,0);
        }
    }
}

function nb_cells_autour(x,y){
    // fonction qui renvoie le nombre de voisins vivants d'une cellule
    // fonction à revoir pour le système de carré dont les côtés se rejoignent
    nb=0;
    if (y-1>=0){
		if (grid[x][y-1].statut!=0)
			nb+=1;
	}
    if (y+1<gridHeight){
		if (grid[x][y+1].statut!=0)
			nb+=1;
	}
    if (x-1>=0){
		if (grid[x-1][y].statut!=0)
			nb+=1;
	}
    if (x+1<gridLength){
		if (grid[x+1][y].statut!=0)
			nb+=1;
	}
    if (x-1>=0 && y-1>=0){
		if (grid[x-1][y-1].statut!=0)
			nb+=1;
	}
    if (x-1>=0 && y+1<gridHeight){
		if (grid[x-1][y+1].statut!=0)
			nb+=1;
	}
    if (x+1<gridLength && y-1>=0){
		if (grid[x+1][y-1].statut!=0)
			nb+=1;
	}
    if (x+1<gridLength && y+1<gridHeight){
		if (grid[x+1][y+1].statut!=0)
			nb+=1;
	}
    return nb;
}

function game(){
    // la fonction de mise à jour de la grille avec les règles
    grid_next = new Array(gridLength);
	for (i = 0; i < gridLength; i++){
		grid_next[i] = new Array(gridHeight);
	}		

    for (x = 0; x < gridLength; x++){
		for (y = 0; y < gridHeight; y++){
			nb = nb_cells_autour(x,y);
            if (nb==3){
                grid_next[x][y]=1    // rule 1
            }else if (nb==2)
                grid_next[x][y]=2    // rule 2
			else if (nb < 2 || nb > 3)
                grid_next[x][y]=3;  // rule 3
        }
    }
    for (x = 0; x < gridLength; x++){
        for (y = 0; y < gridHeight; y++){
            nb = nb_cells_autour(x,y);
            if (grid_next[x][y]==1)
                grid[x][y].statut=1; // rule 1
            else if (grid_next[x][y]==2)
                grid[x][y].augmenterTempsVie(); // rule 2
            else if (grid_next[x][y]==3)
                grid[x][y].statut=0;  // rule 3
        }
    }
    if (isActive){
        temps=vitesse.value;
        console.log(temps);
        if (temps!=0){
            if (temps<=1)
                timeout=1000/temps; // A Vitesse x0.1 : 10 secondes
            else // A Vitesse x1 : 1 seconde
                timeout=1000/(temps**(4.3));   // A Vitesse x2 : 50 ms
            setTimeout(game, timeout); // A Vitesse x0.1 : 10 secondes
        }
    }
}

