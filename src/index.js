import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";

const graph = new Graph();

const nodeA = new Node({ id: "1", label: "Node A", x: 50, y: 50 });
const nodeB = new Node({ id: "2", label: "Node B", x: 100, y: 100 });
const nodeC = new Node({ id: "3", label: "Node C", x: 150, y: 200 });
const nodeD = new Node({ id: "4", label: "Node D", x: 200, y: 300 });
const nodeE = new Node({ id: "5", label: "Node E", x: 250, y: 400 });

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);
graph.addNode(nodeD);
graph.addNode(nodeE);

graph.linkNodes(nodeA, nodeB);
graph.linkNodes(nodeA, nodeC);
graph.linkNodes(nodeA, nodeD);
graph.linkNodes(nodeA, nodeE);

console.log("Nodes in graph:", graph.getNodesArray());
console.log("Links in graph:", graph.getLinks());
console.log("Node A weight:", nodeA.weight);
console.log("Node B weight:", nodeB.weight);
console.log("Node C weight:", nodeC.weight);
console.log("Node D weight:", nodeD.weight);
console.log("Node E weight:", nodeE.weight);
