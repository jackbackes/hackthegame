//initializing game
var opponentCount = parseInt(readline()); // Opponent count
var states = new GameModel(35, 20, opponentCount);


function GameModel(width, height, opponentCount){
  this.width = width;
  this.height = height;
  this.opponentCount = opponentCount;
  this.states = [];
  return this;
}

GameModel.prototype.addBeginningState = function(){
  this.gameRound = parseInt(readline());
  var inputs = readline().split(' ');
  this.user = {
    coords: {
      x: parseInt(inputs[0]), // Your x position
      y: parseInt(inputs[1]), // Your y position
      backInTimeLeft: parseInt(inputs[2]) // Remaining back in time
    }
  }

  for (var i = 0; i < opponentCount; i++) {
    this.opponents = {};
    this.opponents[i] = {
        inputs: readline().split(' '),
        coords: {
          x: parseInt(inputs[0]), //  x position of opponenet
          y: parseInt(inputs[1]), // y position of opponent
          backInTimeLeft: parseInt(inputs[2]) // Remaining back in time
        }
      }
  }
  var thisState = {
    board: []
  };
  this.states = [];
  for (var i = 0; i < 20; i++) {
    thisState.board[i] = readline(); // One line of the map ('.' = free, '0' = you, otherwise the id of the opponent)
  }
  this.states.unshift( thisState );
  this.convertToNodes( this.states[0] );
}

GameModel.prototype.convertToNodes = function( currentState ) {
  var self = this;
  var nodeMap = new Array(this.height);
  for( var heightIndex = 0; heightIndex < nodeMap.length; heightIndex++ ){
    nodeMap[ heightIndex ] = new Array( this.width );
    for( var widthIndex = 0; widthIndex < this.width; widthIndex++ ){
      var nodeColor = currentState.board[heightIndex][widthIndex]
      nodeMap[ heightIndex ][ widthIndex ] = new Node( widthIndex, heightIndex, nodeColor );
    }
  }
  // nodeMap = nodeMap.map( function( row, heightIndex ){
  //   printErr('row',row);
  //   row = new Array( this.width ).map( function( node, widthIndex ){
  //     printErr('node',node);
  //     var nodeColor = currentState[heightIndex][widthIndex]
  //     node = new Node( widthIndex, heightIndex, nodeColor );
  //     return node;
  //   })
  //   printErr('row',row);
  //   return row;
  // })
  printErr('nodeMap',Object.keys(nodeMap[0][0]));
  currentState.nodeMap = nodeMap;
  this.connectNodes( currentState );
}

GameModel.prototype.connectNodes = function( currentState ) {
  currentState.nodeMap.forEach( function(row, heightIndex){
    row.forEach( function( node, widthIndex ){
      node.connectNeighbors();
    })
  })
}

function Node(x, y, color) {
  this.neighbors = [];
  this.connections = [];
}

Node.getNeighbors = function() {};
Node.getNeighbor = function() {};
Node.connectNeighbors = function() {};
Node.connectNeighbor = function() {};
Node.setShape = function( shape ) {
  this.shape = shape;
}
Node.addToQueue = function( queue ) {
  queue.push( this );
}
Node.addConnectionToQueue = function( queue, connection ) {
  queue.push( neighbor );
}
Node.addConnectionsToQueue = function( queue ) {
  var self = this;
  this.connections.forEach( function(connection) {
    self.addConnectionToQueue( queue, connection )
  })
}



//initializing round
var currentRound = 0;
while(currentRound < 10){
  states.addBeginningState();
  var currentTurnState = states.states[0];

  print('0 0');
  currentRound++;
}
