function playPause(button){
    isActive = !isActive
    if(isActive){
        button.children[0].src = "images/pause.png"
    } else {
        button.children[0].src = "images/play.png"
    }
}

function random(button){    
    randomFill(parseInt(taux_remplissage.value)/100);
}
