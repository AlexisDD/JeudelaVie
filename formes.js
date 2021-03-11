var formsList;
var lettersList;

var parentContainer = document.getElementById("data-container");
var div_dynamique = document.getElementById("img_dynamique_container");

var regAccentA = new RegExp('[àâä]', 'gi');
var regAccentE = new RegExp('[éèêë]', 'gi');

loadLetters();

function display_img_bouge(event){
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