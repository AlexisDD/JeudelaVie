class Cellule {
    /** Pour définir une nouvelle cellule : 
     * const cellule = new Cellule(statut) avec statut = 1/0 ou true/false.
     **/
   constructor(x,y,statut) {
       this._tempsVie = 0;
       this._x = x;
       this._y = y;        
       this.statut = statut;
   }
 
   get statut() {
       return this._statut;
   }
 
   set statut(value) {
       if(value == 1)
           this.augmenterTempsVie();
       else
           this._tempsVie = 0;
       this._statut = value;
       this.dessiner();
   }

   get tempsVie() {
       return this._tempsVie;
   }

   set tempsVie(value){
       this._tempsVie = value;
   }

   augmenterTempsVie(){
       this._tempsVie++;
   }

   dessiner() {
       ctx.beginPath();
       ctx.lineWidth = "0.2";
       ctx.clearRect((this._x * cellSize)-1, (this._y*cellSize)-1, cellSize+2, cellSize+2);
       if (this._statut!=0){
            ctx.fillStyle = 'rgba(0, 0, 0, ' + this._tempsVie / 4 + ')'; 
            ctx.rect(this._x * cellSize, this._y*cellSize, cellSize, cellSize); 
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeRect(this._x * cellSize, this._y*cellSize, cellSize, cellSize);
        }
   }
}