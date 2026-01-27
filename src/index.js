import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./view/CanvasDrawer.js";
import { Camera } from "./view/Camera.js";
import { Interaction } from "./controller/Interaction.js";

const graph = new Graph();

const nodeA = new Node({ id: "1", label: "Node A", x: 50, y: 50 });
const nodeB = new Node({ id: "2", label: "Node B", x: 200, y: 150 });
const nodeC = new Node({ id: "3", label: "Node C", x: 400, y: 300 });
const nodeD = new Node({ id: "4", label: "Node D", x: 600, y: 250 });
const nodeE = new Node({ id: "5", label: "Node E", x: 800, y: 100 });

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

const canvas = document.getElementById("graphCanvas");
const camera = new Camera();
const drawer = new CanvasDrawer(canvas, camera);
const interaction = new Interaction(canvas, graph, camera);

function renderGraph() {
  drawer.draw(graph);
  requestAnimationFrame(renderGraph);
}

renderGraph();
