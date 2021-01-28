var imageButtonPlay = document.getElementById("button_play");
var iterationsOutput = document.getElementById("iterations");
var cellulesVivantesOutput = document.getElementById("alive");

function playPause(){
    isActive = !isActive
    if(isActive){
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
}