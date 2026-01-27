import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";

const graph = new Graph();

const nodeA = new Node({ id: "1", label: "Node A" });
const nodeB = new Node({ id: "2", label: "Node B" });
const nodeC = new Node({ id: "3", label: "Node C" });

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);

graph.linkNodes(nodeA, nodeB);
graph.linkNodes(nodeB, nodeC);
graph.linkNodes(nodeC, nodeA);
console.log("Nodes in graph:", graph.getNodesArray());
console.log("Links in graph:", graph.getLinks());
