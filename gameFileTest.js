//initializing game
var N_RANDOM_NODES = 20;
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
    playerIndex: 0;
    coords: {
      x: parseInt(inputs[0]), // Your x position
      y: parseInt(inputs[1]), // Your y position
      backInTimeLeft: parseInt(inputs[2]) // Remaining back in time
    }
  }

  this.players = [this.user];

  for (var i = 0; i < opponentCount; i++) {
    this.opponents = {};
    this.opponents[i] = {
        playerIndex: i+1;
        inputs: readline().split(' '),
        coords: {
          x: parseInt(inputs[0]), //  x position of opponenet
          y: parseInt(inputs[1]), // y position of opponent
          backInTimeLeft: parseInt(inputs[2]) // Remaining back in time
        }
      }
    this.players.push(this.opponents[i]);
  }


  var thisState = {
    board: []
  };

  for (var i = 0; i < 20; i++) {
    thisState.board[i] = readline(); // One line of the map ('.' = free, '0' = you, otherwise the id of the opponent)
  }
  thisState.width = this.width;
  thisState.height = this.height;
  this.states.unshift( thisState );
  this.states[ 0 ].nodeIndex = 0;
  this.convertToNodes( this.states[0] );
}

GameModel.prototype.convertToNodes = function( currentState ) {
  var self = this;
  var nodeMap = new Array(this.height);
  for( var heightIndex = 0; heightIndex < nodeMap.length; heightIndex++ ){
    nodeMap[ heightIndex ] = new Array( this.width );
    for( var widthIndex = 0; widthIndex < this.width; widthIndex++ ){
      var nodeColor = currentState.board[heightIndex][widthIndex]
      nodeMap[ heightIndex ][ widthIndex ] = new Node( widthIndex, heightIndex, nodeColor, currentState, currentState.nodeIndex++ );
    }
  }
  currentState.nodeMap = nodeMap;
}

GameModel.prototype.connectNodes = function( currentState ) {
  currentState.nodeMap.forEach( function(row, heightIndex){
    row.forEach( function( node, widthIndex ){
      node.connectNeighbors();
    })
  })
  return this;
}

GameModel.prototype.findNodeNeighbors = function( currentState ){
  currentState.nodeMap.forEach( function(row, heightIndex){
    row.forEach( function( node, widthIndex ){
      node.getNeighbors();
    })
  })
}

GameModel.prototype.findNeutrals = function( state ){
  state = state || this.states[0];
  state.neutrals = []
  state.nodeMap.forEach( function( row ) {
    row.forEach( function( node ){
      state.neutrals.push( node );
    })
  })
  return this;
}

GameModel.prototype.pickNRandomNodesOfColor = function( n, state, color ){
  var self = this;
  state = state || this.states[0];
  color = color || '.';
  if(state.neutrals) { var neutrals = state.neutrals }
  else { var neutrals = this.findNeutrals(state) }
  randomNodes = new Array(n);
  for( var nodeIndex = 0; nodeIndex < randomNodes.length; nodeIndex++ ){
    var neutralIndex = Math.floor( Math.random() * neutrals.length )
    randomNodes[ nodeIndex ] = neutrals[ neutralIndex ];
  }
  return randomNodes;
}

GameModel.prototype.processRandomNodes = function( state ){
  var self = this;
  state = state || this.states[0];
  var randomNodes = this.findNeutrals( state ).pickNRandomNodesOfColor( N_RANDOM_NODES, state, '.' );
  state.randomNodes = randomNodes;
  randomNodes.forEach( function( node ){
      var thisShape = node.createShape();
      if(!state.queue) state.queue = [];
      node.processed = true;
      node.addConnectionsToQueue( state.queue, thisShape );
  })
}

GameModel.prototype.tesellate = function( state ){
  state = state || this.states[0]
  this.processRandomNodes( state );
  this.processEntireQueue( state );
  return this;
}

// GameModel.prototype.persistTesellation = function(){
//   var state = this.states[0];
//   var previousState = this.states[1];
//   state.randomNodes = previousState.randomNodes;
//   state.randomNodes.forEach( function( node ){
//       var thisShape = node.createShape();
//       if(!state.queue) state.queue = [];
//       node.processed = true;
//       node.addConnectionsToQueue( state.queue, thisShape );
//   })
//   this.processEntireQueue( state );
// }

GameModel.prototype.addToQueue = function( node, state ){
  state = state || this.state[0];
  if(!state.queue) state.queue = [];
  state.queue.push( node );
  return state.queue;
}

GameModel.prototype.processQueue = function( state ){
  var self = this;
  state = state || this.state[0];
  var nodeToProcess = state.queue.shift();
  nodeToProcess.processed = true;
  nodeToProcess.setShape()
  return nodeToProcess.addConnectionsToQueue( state.queue, nodeToProcess.shape );
}

GameModel.prototype.processEntireQueue = function( state ){
  var self = this;
  state = state || this.state[0];
  while( state.queue.length ){
    this.processQueue( state );
  }
}

function Node(x, y, color, parentState, nodeIndex) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.neighbors = [];
  this.connections = [];
  this.parentState = parentState;
  this.nodeIndex = nodeIndex;
}

Node.prototype.getNeighbors = function() {
  var x = this.x;
  var y = this.y;
  // [0: NW, 1: N, 2: NE, 3: W, 4: E, 5: SW, 6: S, 7: E]
  this.getNeighbor( x-1, y-1, 'NW' );
  this.getNeighbor( x  , y-1, 'N'  );
  this.getNeighbor( x+1, y-1, 'NE' );
  this.getNeighbor( x-1, y  , 'W'  );
  this.getNeighbor( x+1, y  , 'E'  );
  this.getNeighbor( x-1, y+1, 'SW' );
  this.getNeighbor( x  , y+1, 'S'  );
  this.getNeighbor( x+1, y+1, 'SE' );
};
Node.prototype.getNeighbor = function( neighborX, neighborY, direction ) {
  // [0: NW, 1: N, 2: NE, 3: W, 4: E, 5: SW, 6: S, 7: E]
  if( neighborX >= 0 &&
      neighborX < this.parentState.width &&
      neighborY >= 0 &&
      neighborY < this.parentState.height) {
        this.neighbors.push( this.parentState.nodeMap[ neighborY ][ neighborX ] )
      } else {
        this.neighbors.push( null );
      }
};
Node.prototype.connectNeighbors = function() {
  var thisNode = this;
  this.neighbors.forEach( function( neighborNode ){
    if( neighborNode ) thisNode.connectNeighbor( neighborNode );
  })
};
Node.prototype.connectNeighbor = function( neighborNode ) {
  this.connections.push( neighborNode );
};
Node.prototype.setShape = function() {
  var shape = this.shape;
  shape.nodes.push( this );
}
Node.prototype.addToQueue = function( queue ) {
  if( this.processed !== true ) {
    this.processed = true;
    queue.push( this )
  };
}
Node.prototype.addConnectionToQueue = function( queue, connection, shape ) {
  connection.shape = shape;
  if( connection.processed !== true ) connection.addToQueue( queue );
}
Node.prototype.addConnectionsToQueue = function( queue, shape ) {
  var self = this;
  var color = self.color;
  this.connections.forEach( function( connection ) {
    if(connection.color === self.color) self.addConnectionToQueue( queue, connection, shape )
  })
}

//called on n random nodes for mock tesellation
Node.prototype.createShape = function(){
  var self = this;
  var parent = this.parentState;
  var color = this.color;
  if( !parent.shapes ) parent.shapes = {
    '0': [],
    '1': [],
    '2': [],
    '.': []
  }
  this.shape = new Shape( color, parent.shapes[ color ].length || 0, self )
  parent.shapes[ color ].push( this.shape );
  return this.shape;
}

function Shape( color, shapeIndex, startingNode ) {
  this.nodes = [ startingNode ];
}
Shape.prototype.findCentroid = function(){}

//minimax function
var Minimax = function(state, depth, maximizingPlayer, heuristic){
  return this;
}

Minimax.prototype.setDepth = function( depth ){
  this.depth = depth;
  return this;
}


Minimax.prototype.state = function( state ){
  this.state = state;
  return this;
}

Minimax.prototype.addHeuristic = function( heuristic, weighting ) {
  this.heuristics.push( {heuristic, weighting} );
  return this;
}

Minimax.prototype.maximizingPlayer = function( maximizingPlayer ){
  this.maximizingPlayer = maximizingPlayer;
  return this;
}

Minimax.prototype.minimizingPlayers = function( players, maximizingPlayer ){
  var maximizingPlayer = maximizingPlayer || this.maximizingPlayer;
  this.minimizingPlayers = players.filter( function( player ){
    return maximizingPlayer.playerIndex !== player.playerIndex;
  })
  return this;
}


Minimax.prototype.calculateHeuristicValue( heuristic, state ){
  var maximizingPlayer = this.maximizingPlayer;
  var minimizingPlayers = this.minimizingPlayers;
  var max = this.heuristics.reduce( function( previous, weightedHeuristic ){
    var heuristic = weightedHeuristic.heuristic;
    var weighting = weightedHeuristic.weighting;
    return prev + weighting * heuristic( state, maximizingPlayer );
  })
  var mins = minimizingPlayers.map( function( minimizingPlayer ) {
    this.heuristics.reduce( function( previous, weightedHeuristic ){
      var heuristic = weightedHeuristic.heuristic;
      var weighting = weightedHeuristic.weighting;
      return prev + weighting * heuristic( state, minimizingPlayer );
    })
  })
  this.heuristicValues = {
    max: max,
    mins: mins
  }
  return this;
}

Minimax.prototype.exec = function(){
  var possibleStates = this.state.nextStates();
  if (!depth || !possibleStates.length) return heuristic(state, maximizingPlayer);
  var currentPlayer = state.nextMovePlayer;
  var reducerFn = maximizingPlayer === currentPlayer ? Math.max : Math.min;
  var mappedStates = possibleStates.map(function(state){
    var miniresult = minimax(state, depth-1, maximizingPlayer);
    //console.log('depth:',depth,'MINIresult:',miniresult)
    return miniresult;
  });
  //console.log('depth:',depth,'MAPPEDstates:',mappedStates)
  var result = reducerFn(...mappedStates);
  //console.log('depth:',depth,'result:',result);
  return result;
}

// ========
//heuristics go here (add to Minimax with addHeuristic( heuristic, weighting ))
// ========

var heuristics = {
  shapeArea: {
    heuristic: function( state, player ){},
    weighting: 0.5
  },
  movesToClose: {
    heuristic: function( state, player ){},
    weighting: 0.5
  },
  neutralsToClose: {
    heuristic: function( )
  }
}


function shapeArea( shape ){
  return shape.nodes.length;
}
function getShapePerimeter( shape ){
  var color = shape.color;
  shape.perimeter = shape.nodes.filter( function( node ){
    return node.connections.color !== color;
  })
  return shape.perimeter;
}
function nonColoredPerimeter( player, shape ){
  var playerColor = player.color;
  var shapePerimeter = shape.perimeter || getShapePerimeter( shape );
  return shapePerimeter.filter( function( node ){
    return node.color != playerColor;
  })
}
Shape.prototype.getCenter(){

}
function sortPerimeterByDistance( player, shape, state){
  var shapePerimeter = nonColoredPerimeter( player, shape );
  return shapePerimeter.sort( function( prevNode, node ){
    var playerX = player.coords.x;
    var playerY = player.coords.y;
    var currentX = node.x;
    var currentY = node.y;
    var currentDist = Math.abs( playerX - currentX ) + Math.abs( playerY - currentY );
    var prevX = prevNode.x;
    var prevY = prevNode.y;
    var prevDist = Math.abs( playerX - prevX ) + Math.abs( playerY - prevY );
  })
}
function bestPathToCenter( player, shape, state ){}
function bestPathToPerimeter( player, shape ){}
function movesToClose( shape, player, state ){}
function neutralsToClose( shape, player, state ){}
function scoreForShape( shape, player, state ){}
function scorePerTurn( shape, player, state ){}


// =========
//initializing round
// =========
var currentRound = 0;
var currentTurnState;
while(true){
  states.addBeginningState();
  currentTurnState = states.states[0];
  states.findNodeNeighbors( currentTurnState );
  printErr('234');
  states.connectNodes( currentTurnState );
  printErr('236');
  states.tesellate( currentTurnState );
  printErr('238');
  currentTurnState.shapes['.'].forEach( function( shape ) {
    printErr(shape.nodes[0].x, shape.nodes[0].y, shape.nodes.length);
  });


  print(Math.floor(Math.random()*30) + ' ' + Math.floor(Math.random()*20));

  currentRound++;
}
