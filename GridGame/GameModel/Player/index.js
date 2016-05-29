

module.exports = console.log('this will be the Player Constructor')


class Player {
  constructor(playerIndex, startingCoords, color, botController = this.moveRandom){
    this.controller = botController;
    this.backInTimeLeft = 2;
    this.coords = startingCoords;
    this.score = 0;
    return this;
  }
  print(string){

  }
  getScore(){

  }
  moveRandom(){

  }
  takeTurn(inputs){
    this.controller(inputs, this.print)
  }
}
