// the Turn class generates a new turn

module.exports = class Turn(){
  constructor(turnIndex,previousTurn){
    this.turnIndex = turnIndex;
    this.previousTurn = previousTurn;
    return this;
  };
  generateNext(){
    return new Turn(this.turnIndex + 1, this)
  };
  renderMap(){

  }
  
}
