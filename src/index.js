import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./view/CanvasDrawer.js";

const graph = new Graph();

const nodeA = new Node({ id: "1", label: "Node A", x: 100, y: 100, weight: 1 });
const nodeB = new Node({ id: "2", label: "Node B", x: 200, y: 100, weight: 1 });
const nodeC = new Node({ id: "3", label: "Node C", x: 150, y: 200, weight: 1 });
const nodeD = new Node({ id: "4", label: "Node D", x: 250, y: 200, weight: 1 });
const nodeE = new Node({ id: "5", label: "Node E", x: 200, y: 300, weight: 1 });

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);
graph.addNode(nodeD);
graph.addNode(nodeE);

graph.linkNodes(nodeA, nodeB);
graph.linkNodes(nodeA, nodeC);
graph.linkNodes(nodeA, nodeD);
graph.linkNodes(nodeA, nodeE);

const canvas = document.getElementById("graphCanvas");
const drawer = new CanvasDrawer(canvas);

function render() {
  drawer.draw(graph);
  requestAnimationFrame(render);
}

render();
