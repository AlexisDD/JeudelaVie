var imageButtonPlay = document.getElementById("button_play");
var iterationsOutput = document.getElementById("iterations");
var cellulesVivantesOutput = document.getElementById("alive");
var tempsIterationOutput = document.getElementById("temps_iteration");

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

/**  Liste des formes affichage  */

var listFormsModal = document.getElementById("modal_forms");
var btnDisplay = document.getElementById("display_forms_list");
var btnClose = document.getElementById("close_list");

btnDisplay.onclick = function() {
    listFormsModal.style.display = "block";
}

btnClose.onclick = function() {
    listFormsModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == listFormsModal) {
        modal.style.display = "none";
    }
}