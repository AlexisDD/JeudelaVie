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

/**
 * Met en pause ou redémarre le jeu de la vie.
 * Cette fonction est appelée à chaque fois qu'une pause est demandée par l'utilisateur ou lorsque
 * les conditions d'arrêt sont réunies.
 */
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

/**
 * Remplit aléatoirement la grille en fonction du taux de remplissage donné
 */
function random(){    
    randomFill(parseInt(tauxRemplissage.value)/100);
}

/**
 * Change la vitesse des itérations
 * @param {object} input - l'objet input HTML contenant la valeur de vitesse
 */
function inputVitesse(input){
    vitesse_output.value = input.value;
    delay = calculateDelay(input.value);
    updateStats();
}

/**
 * Efface le contenu de la grille
 */
function clearGrid(){
    if(isActive)
        playPause()
    nbIterations = 0;
    nbCellulesVivantes = 0;
    cellulesParIteration = [];
    updateStats();
    initGrid(false);
}

/**
 * Met à jour les statistiques à chaque itération
 */
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

/**
 * Réinitialise la grille et change sa taille sur demande de l'utilisateur
 */
function sizeChange(){
    width = longueurInput.value;
    height = largeurInput.value;
    cellSize = parseInt(tailleCelluleInput.value);
    calculateCanvasSize();
    initGrid(true);
}

/**
 * Vérifie si la valeur de l'objet input donné est bien comprise entre son min et son max, sinon
 * la corrige
 * @param {HTMLObjectElement} element 
 * @param {HTMLObjectElement} outputElement - l'élément "slider" dont la valeur va être modifiée en conséquence
 */
function checkInputValue(element, outputElement){
    const value = parseInt(element.value);
    if(value < element.min){
        outputElement.value = element.min;
    } else if(value > element.max) {
        element.value = element.max;
    }
 
    outputElement.value = element.value;
    sizeChange();
}

/**
 * Quand un champ de texte de type nombre est déselectionné, on vérifie si sa valeur est plus grande que son min.
 * @param {HTMLObjectElement} element 
 */
function checkMinValue(element){
    const value = parseInt(element.value);
    console.log("min:", element.min)
    if(value < element.min){
        element.value = element.min;
    }
}

/**
 * Affiche ou non le graphe des statistiques
 * @param {boolean} checked - true si la case est cochée, false sinon
 */
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

/**
 * À partir de la chaîne de caractère donnée, cette fonction vérifie si elle peut être affichée dans la grille puis
 * récupère toutes les lettres (leurs patterns) nécéssaires et appelle une fonction qui affichera la résultat dans la grille.
 * @param {string} chain - Chaîne de caractère à afficher
 */
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
        for (let i = 0; i < chain.length; i++) {
            var code = chain.charCodeAt(i);
            chainLetters.push(lettersList.find(letter => letter.getElementsByTagName("name")[0].innerHTML == "chr"+code));
        }
        displayAscii(chainLetters);
    } else {
        p.append("L'expression donnée ne peut pas être insérée dans la grille.");
    }        
    parent.append(p);
}