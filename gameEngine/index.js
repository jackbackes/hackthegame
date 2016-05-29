

const Game = require('./modules/GameEngine')
const Map = require('./Map')
const Player = require('./Player')
const Node = require('./Node')


class GridGame extends Game {
  constructor(width, height){
    super();

  }
  generatePlayers(num){
    this.user = new Player('user', coords, )
  }
}

module.exports = function(){
  return new GridGame();
}
