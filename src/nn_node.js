var nodeTypes = ["bias", "input", "output", "hidden"];

function Node(id, type) {
    if(type && !nodeTypes.includes(type)) throw type + " is not a recognized node type";
    this.id = id || 0;
    this.type = type || "hidden";
}

module.exports = Node;
