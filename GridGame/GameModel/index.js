

module.exports = class GameModel{
  constructor(){
    return this;
  }
  map(width, height){
    this.map = require('./Map')(width, height)
  }
  play(){}
}
