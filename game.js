var width = 600;
var height = 600;
var cellSize = 20;
var isActive = false;
var formsList;
var lettersList;

var gridLength;
var gridHeight;

var c = document.getElementById("grille");
var tauxRemplissage = document.getElementById("taux_remplissage");
var vitesse = document.getElementById("vitesse");
var parentContainer = document.getElementById("data-container");
var div_dynamique = document.getElementById("img_dynamique_container");

var regAccentA = new RegExp('[àâä]', 'gi');
var regAccentE = new RegExp('[éèêë]', 'gi');

var delay = 1000;
var timer;
var nbIterations = 0;
var nbCellulesVivantes = 0;
var cellulesParIteration = [];
var statutPrecedent;

var ctx = c.getContext("2d");
var grid = new Array(gridLength);

calculateCanvasSize();
initGrid();
loadLetters();

/**
 * Ecoute les clics sur la grille et modifie le statut de la cellule cliquée
 */
c.addEventListener('click', function(event) {
    if (isActive){
        playPause();
        clearTimeout(timer);
    }        
    if(document.getElementById("img_bouge") != null){
        x = event.clientX;
        y = event.clientY;    
        if (x < (width+left_canvas-img_bouge.width) &&  y < (height+top_canvas-img_bouge.height)){   
            img=document.getElementById("img_bouge");
            name=img.alt;
            div_dynamique.removeChild(document.getElementById("img_bouge"));
            forme = formsList.find(forme => forme.getElementsByTagName("name")[0].innerHTML == name)
            var x = Math.floor(event.offsetX / cellSize)+1;
            var y = Math.floor(event.offsetY / cellSize);
            if(forme !== undefined)
                displayForm(forme, x, y);
        }   
    } else{
        ajoutManuel(event);
    }
}, false);

/**
 * Modifie le statut de la cellule cliquée. Si elle était morte, elle devient vivante, ...
 * @param {event} event objet "event" contenant les coordonnées du clic et d'autres informations
 */
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

function calculateCanvasSize(){
    if(width % cellSize != 0 || height % cellSize != 0){
        gridLength = Math.floor(width / cellSize);
        gridHeight = Math.floor(height / cellSize);
        width -= width % cellSize;
        height -= height % cellSize;
    } else {
        gridLength = width / cellSize;
        gridHeight = height / cellSize;
    }
    c.width=width;
    c.height=height;
}
/**
 * Initialise la grille du jeu, et dessine toutes les cellules (mortes pour l'instant)
 */
function initGrid(){    
    cellulesParIteration = [];
    ctx.beginPath();
    ctx.lineWidth = "0.2";
    for (var x = 0; x < gridLength; x += 1){        
        grid[x] = new Array(gridHeight); 
        for (var y = 0; y < gridHeight; y += 1){
            ctx.rect(x * cellSize, y*cellSize, cellSize, cellSize);            
            grid[x][y]=new Cellule(x,y,0);
        }
    }
    ctx.stroke();
 }

 /**
  * Rempli aléatoirement la grille
  * @param {number} alea taux entre 0 et 1 de remplissage de la grille
  */
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

/**
 * À partir d'une cellule, renvoie le nombre de cellules vivantes autour de celle-ci
 * @param {number} x coordonnée x de la cellule 
 * @param {number} y coordonnée y de la cellule
 * @returns {number} le nombre de cellules vivantes
 */
function nbCellulesAutour(x,y){
    var nbVivantProche = 0;
    for (let posX = x-1; posX < x+2; posX++) {
        for (let posY = y-1; posY < y+2; posY++){
            if (!(posX == x && posY == y)){
                posX1 = posX;
                posY1 = posY;
                if (posX < 0)
                    posX1 = gridLength-1;
                if (posY < 0)
                    posY1 = gridHeight-1;                 
                if (posX>gridLength-1)
                    posX1 = 0;
                if (posY>gridHeight-1)
                    posY1 = 0;           
                if (grid[posX1][posY1].statut == 1)
                nbVivantProche += 1
            }
        }
    }
    return nbVivantProche;
}

/**
 * Fonction principale pour la mise à jour de la grille selon les règles du jeu de la vie, repétée selon le délai choisi
 */
function game(){
    const statut_next = grid.map(array => array.map(cellule => cellule.statut));
    if(nbIterations % 2 == 0)
        statutPrecedent = grid.map(array => array.map(cellule => cellule.statut));
    
    for (x = 0; x < gridLength; x++){
		for (y = 0; y < gridHeight; y++){
            var nb = nbCellulesAutour(x,y);
            if (nb == 3)
                statut_next[x][y]=1;
            else if (nb < 2 || nb > 3)
                statut_next[x][y]=0;
        }
    }

    var nbVivants = 0;
    var nbChangements = 0;
    statut_next.forEach(function (array, x) {
        array.forEach(function(statut, y){
            if(statut == 1)
                nbVivants++;
            if(grid[x][y].statut == statut)
                nbChangements++;
            grid[x][y].statut = statut;
        });
    });

    nbIterations++;
    nbCellulesVivantes = nbVivants;
    cellulesParIteration.push(nbCellulesVivantes);
    updateData(cellulesParIteration);
    updateStats();

    // Si aucune cellule n'a changé de statut ou la grille est vide, arrêt du jeu
    if(nbChangements == 0  || nbCellulesVivantes == 0 || arraysEqual(statutPrecedent, statut_next)){
        playPause();
        var p = document.createElement("p");
        p.setAttribute("id", "fin_jeu");
        p.append("Le jeu s'est arrêté car le motif se repète à l'infini.");
        p.style.cssText = 'font-size: medium; font-weight: bold; margin: 20px;';
        parentContainer.append(p);
    }

    if (isActive){
        var temps=vitesse.value;
        delay = calculateDelay(temps);
        if(delay != 0)
            timer = setTimeout(game, delay); 
        else 
            playPause();
    }
}

/**
 * A Vitesse x0.1 : 10 secondes, A Vitesse x1 : 1 seconde, A Vitesse x2 : 50 ms
 * @param {number} temps le multiplicateur de vitesse séléctionné
 */
function calculateDelay(temps){
    var delay;
    if(temps != 0){
        if (temps<=1)
            delay=1000/temps; 
        else
            delay=1000/(temps**(4.3));   
        return delay;
    } else {
        return 0;
    }
}

function arraysEqual(a1, a2) {
    if (a1 == null || a2 == null || (a1.length != a2.length))
        return false;
    for (var i = 0; i < a1.length; ++i) {
        if (Array.isArray(a1[i]) && Array.isArray(a2[i])) {
            if(!arraysEqual(a1[i], a2[i]))
                return false;
        } else {     
            if(a1[i] != a2[i]){
                return false;
            }
        }
    }
    return true;
  }

function loadXML(file, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.timeout = 2000;
    
    xhr.onload = callback;

    xhr.send(null);
}

function loadForms(){
    if(formsList === undefined){
        loadXML('formes/formes.xml', function () {
            formsList = Array.from(this.responseXML.getElementsByTagName("forme"));
            fillFormsList();
        });
    }
}

function loadLetters(){
    if(lettersList === undefined){
        loadXML('formes/lettres.xml', function () {
            lettersList = Array.from(this.responseXML.getElementsByTagName("lettre"));
        });
    }
}

function fillFormsList(){    
    var parent = document.getElementById("forms_content");
    if(document.getElementById("forms_table") != null)
        parent.removeChild(document.getElementById("forms_table"));
    var table = document.createElement("table");
    table.id = "forms_table";

    /* Table Head : légende */
    var tableHead = document.createElement("thead");
    var headRow = document.createElement("tr");
    var previewTitle = document.createElement("td");
    previewTitle.innerHTML = "Prévisualisation";
    var nameTitle = document.createElement("td");
    nameTitle.innerHTML = "Nom";
    headRow.appendChild(previewTitle);
    headRow.appendChild(nameTitle);
    tableHead.appendChild(headRow);
    table.appendChild(tableHead);
    
    /* Table Body : liste des formes */
    var tableBody = document.createElement("tbody");
    
    for(const forme of formsList){
        var row = document.createElement("tr");
        row.setAttribute("onclick", "choix_forme(this)");

        var cellPreview = document.createElement("td");
        var name=forme.getElementsByTagName("name")[0].innerHTML;

        old_name=name;
        name = name.replace(regAccentA, 'a'); // problème avec le serveur qui n'accecpte pas les accents
        name = name.replace(regAccentE, 'e');
        
        var img = document.createElement("img");
        img.src="formes/img/" + name + ".jpg";
        img.alt = old_name;

        var cellName = document.createElement("td");
        cellName.innerHTML = old_name;

        row.appendChild(cellPreview);        
        cellPreview.appendChild(img);
        row.appendChild(cellName);
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    parent.appendChild(table);
}

function choix_forme(container){
    name=container.getElementsByTagName("td")[1].innerHTML;
    old_name=name;
    name = name.replace(regAccentA, 'a');
    name = name.replace(regAccentE, 'e');
    


    // Vérification de la taille minimale de la grille
    forme = formsList.find(forme => forme.getElementsByTagName("name")[0].innerHTML == old_name);
    img_width = parseInt(forme.getElementsByTagName("min")[0].getElementsByTagName("width")[0].innerHTML) + 2 ;
    img_height = parseInt(forme.getElementsByTagName("min")[0].getElementsByTagName("height")[0].innerHTML) + 2 ;
    cell = tailleCelluleInput.value;
    width = longueurInput.value;
    height = largeurInput.value;
    new_width= cell*img_width+4*cell;
    new_height= cell*img_height+4*cell;
    img_cell_min=cell;
    max_width=longueurInput.max;
    max_height=largeurInput.max;
    if (new_width > width || new_height > height){    
        if (new_width > width){
            if (new_width > max_width)
                width = max_width;
            else 
                width = new_width;
            longueurInput.value=width;       
            longueur_output.value=width;   
        }
        if (new_height > height){
            if (new_height > max_height)
                height = max_height;
            else 
                height = new_height;
            largeurInput.value=height;       
            largeur_output.value=height;   
        }
        if (new_width > width || new_height > height){
            img_cell_min = Math.min( parseInt(width/img_width)-1 , parseInt(height/img_height)-1);
            if (img_cell_min < tailleCelluleInput.min || img_cell_min > tailleCelluleInput.max){
                alert("Impossible de placer la forme");
            }
            taille_cellule_output.value=img_cell_min;
            tailleCelluleInput.value=img_cell_min; 
        } 
        sizeChange();     
    }
    new_width= img_cell_min*img_width;
    new_height= img_cell_min*img_height;
    window.scroll(0,0);
    left_canvas= c.getBoundingClientRect().left;
    top_canvas = c.getBoundingClientRect().top; 
    
    var img = document.createElement("img");
    img.src="formes/img/" + name + ".jpg";
    img.alt = old_name;   
    img.id="img_bouge";    
    img.setAttribute("style", "position:absolute; left:" + left_canvas + "px; " + "top:" + top_canvas + "px; width:" + new_width + "px; display:block;");
    div_dynamique.appendChild(img);

    btnClose.click();
      
}


document.onmousemove = function (event){       
    x = event.clientX;
    y = event.clientY;     
    left_canvas= c.getBoundingClientRect().left;
    top_canvas = c.getBoundingClientRect().top;
    width = c.width;
    height = c.height;
    if (x > left_canvas && x < (width+left_canvas) && y > top_canvas && y < (height+top_canvas)){           
        if(document.getElementById("img_bouge") != null){
            img_bouge=document.getElementById("img_bouge");
            if (x < (width+left_canvas-img_bouge.width) &&  y < (height+top_canvas-img_bouge.height)){
                img_bouge.style.left =  (x + 1) + 'px';
                img_bouge.style.top  =  (y + 1) + 'px';
            }
        }
    }
}

document.oncontextmenu = function (){          // à chaque clic droit 
    if(document.getElementById("img_bouge") != null){
        div_dynamique.removeChild(document.getElementById("img_bouge"));
        return false;
    }
}

document.onkeydown = function(event){
    if(document.getElementById("img_bouge") != null){
        keynum = event.which;
        if (keynum == 8 ||  keynum ==27 || keynum ==46 || keynum ==110) // espace, backspace, del, del (numpad) 
            div_dynamique.removeChild(document.getElementById("img_bouge"));
    }
}

function displayAscii(formsToDisplay){
    var x = 0;
    var line = 0;
    for (const forme of formsToDisplay) {
        var pattern = forme.getElementsByTagName("pattern")[0].innerHTML
        var patternLines = pattern.split("\\n");
        var max = x + patternLines.length;
        if(max >= gridLength){
            x=0;
            line++;
        }
        for (let element of patternLines) {
            y= (line*8)+1;
            x++;
            for(let c of element){
                s = parseInt(c);
                if (grid[x][y].statut != s){
                    grid[x][y].statut = s;
                    if(grid[x][y].statut)
                        nbCellulesVivantes++;
                    else
                        nbCellulesVivantes--;
                }
                y++;
                if(y >= gridHeight)
                    break;
            }
        }
    }
    updateStats();
}

function displayForm(forme, x, y){
    var x_depart = x;
    var pattern = forme.getElementsByTagName("pattern")[0].innerHTML;
    var patternLines = pattern.split("\\n");
    for (let element of patternLines) {
        x=x_depart;
        y++;
        for(let c of element){
            s = parseInt(c);
            if (grid[x][y].statut != s){
                grid[x][y].statut = s;
                if(grid[x][y].statut)
                    nbCellulesVivantes++;
                else
                    nbCellulesVivantes--;
            }
            x++;
            if(y >= gridHeight)
                break;
        }
    }
    updateStats();
}