//the game loop executes
var Turn = require('./Turn');

module.exports = class Loop{
  constructor(){
    console.log('this will be the game loop')
  }
  getCurrentTurn(){};
  play(){};
  pause(){};
  forward(){};
  back(){};
  skip(n){};
  end(){};
}
