var imageButtonPlay = document.getElementById("button_play");
var iterationsOutput = document.getElementById("iterations");
var cellulesVivantesOutput = document.getElementById("alive");
var tempsIterationOutput = document.getElementById("temps_iteration");
var longueurInput = document.getElementById("longueur_grille");
var largeurInput = document.getElementById("largeur_grille");
var tailleCelluleInput = document.getElementById("taille_cellule");

var longueur_output = document.getElementById("longueur_output");
var largeur_output = document.getElementById("largeur_output");
var taille_cellule_output = document.getElementById("taille_cellule_output");

function playPause(){
    isActive = !isActive
    if(isActive){
        var finJeu = document.getElementById("fin_jeu");
        if(finJeu != null)
            parentContainer.removeChild(finJeu);
        imageButtonPlay.src = "images/pause.png"        
        game()
    } else {
        clearTimeout(timer);
        updateData(cellulesParIteration);
        imageButtonPlay.src = "images/play.png"
    }
}

function random(){    
    randomFill(parseInt(tauxRemplissage.value)/100);
}

function inputVitesse(input){
    vitesse_output.value = input.value;
    delay = calculateDelay(input.value);
    updateStats();
}

function clearGrid(){
    if(isActive)
        playPause()
    nbIterations = 0;
    nbCellulesVivantes = 0;
    cellulesParIteration = [];
    updateStats();
    initGrid();
}

function updateStats(){
    iterationsOutput.value = nbIterations;
    cellulesVivantesOutput.value = nbCellulesVivantes;
    var delaySecond = Math.round((delay/1000)*100)/100;
    if(delaySecond == 0)
        tempsIterationOutput.value = "Pause"
    else if(delaySecond <= 1)
        tempsIterationOutput.value = delaySecond + " seconde";
    else
        tempsIterationOutput.value = delaySecond + " secondes";
}

function sizeChange(){
    width = longueurInput.value;
    height = largeurInput.value;
    cellSize = parseInt(tailleCelluleInput.value);
    calculateCanvasSize();
    initGrid();
}

function toggleGraph(checked){
    var statsField = document.getElementById("statistiques");
    var graph = document.getElementById('graph');
    if(checked){
        statsField.style.display = 'none';        
        graph.style.display = 'block';

    } else {
        statsField.style.display = 'block';
        graph.style.display = 'none';
    }
}

/**  Liste des formes affichage  */

var listFormsModal = document.getElementById("modal_forms");
var btnDisplay = document.getElementById("display_forms_list");
var btnClose = document.getElementById("close_list");

btnDisplay.onclick = function() {
    //En local (sans serveur web): les navigateurs ont une sécurité pour ne pas pouvoir lire des fichiers privés donc impossible de lire les fichiers xml
    if(window.location.protocol === "file:"){
        return
    }
    if(document.getElementById("img_bouge") == null){
        loadForms();
        
        listFormsModal.style.display = "block";
    }
}

btnClose.onclick = function() {
    listFormsModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == listFormsModal)
        listFormsModal.style.display = "none";
}

function insertCharacters(chain){
    var parent = document.getElementById("specific_forms_parent");
    if(document.getElementById("result_form") != null)
        parent.removeChild(document.getElementById("result_form"));
    match = /^\p{ASCII}+$/u.test(chain);        
    
    var p = document.createElement("p");
    p.setAttribute("id", "result_form");
    p.style.cssText = 'font-size: medium; font-weight: bold; margin: 10px;';

    if(match){
        p.append("L'expression donnée a été insérée dans la grille.");
        var chainLetters = [];
        console.log(lettersList);
        for (let i = 0; i < chain.length; i++) {
            var code = chain.charCodeAt(i);
            chainLetters.push(lettersList.find(letter => letter.getElementsByTagName("name")[0].innerHTML == "chr"+code));
        }
        console.log(chainLetters);
        displayAscii(chainLetters);
    } else {
        p.append("L'expression donnée ne peut pas être insérée dans la grille.");
    }        
    parent.append(p);
}