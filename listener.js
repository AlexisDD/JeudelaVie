var iterationsOutput = document.getElementById("iterations");
var cellulesVivantesOutput = document.getElementById("alive");

function playPause(button){
    isActive = !isActive
    if(isActive){
        button.children[0].src = "images/pause.png"        
        game()
    } else {
        button.children[0].src = "images/play.png"
    }
}

function random(button){    
    randomFill(parseInt(tauxRemplissage.value)/100);
}

function updateStats(){
    iterationsOutput.value = nbIterations;
    cellulesVivantesOutput.value = nbCellulesVivantes;
}