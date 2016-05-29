
module.exports = class Node{
  constructor(){
    return this;
  };
  color(color = '.'){
    this.color = color;
    return this;
  };
  parent(parent, type = 'Map'){
    this.parent[type] = parent;
    return this;
  };
  index(nodeIndex){
    this.index = nodeIndex;
    return this;
  };
  coords(x, y){
    this.coords = {x, y}
    return this;
  };
  getNeighbors(){
    var x = this.x;
    var y = this.y;
    // [0: NW, 1: N, 2: NE, 3: W, 4: E, 5: SW, 6: S, 7: E]
    this.getNeighbor(x - 1, y - 1, 'NW');
    this.getNeighbor(x, y - 1, 'N');
    this.getNeighbor(x + 1, y - 1, 'NE');
    this.getNeighbor(x - 1, y, 'W');
    this.getNeighbor(x + 1, y, 'E');
    this.getNeighbor(x - 1, y + 1, 'SW');
    this.getNeighbor(x, y + 1, 'S');
    this.getNeighbor(x + 1, y + 1, 'SE');
  };
  getNeighbor(neighborX, neighborY, direction) {
      // [0: NW, 1: N, 2: NE, 3: W, 4: E, 5: SW, 6: S, 7: E]
      if (neighborX >= 0 &&
          neighborX < this.parentState.width &&
          neighborY >= 0 &&
          neighborY < this.parentState.height) {
          this.neighbors.push(this.parentState.nodeMap[neighborY][neighborX])
      } else {
          this.neighbors.push(null);
      };
  connectNeighbors(){
    var thisNode = this;
    this.neighbors.forEach(function (neighborNode) {
        if (neighborNode) thisNode.connectNeighbor(neighborNode);
    })
  };
  connectNeighbor(neighborNode) {
      this.connections.push(neighborNode);
  };
};
