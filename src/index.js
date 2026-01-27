import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./view/CanvasDrawer.js";
import { Camera } from "./view/Camera.js";
import { Interaction } from "./controller/Interaction.js";
import { InteractionState } from "./controller/InteractionState.js";

const graph = new Graph();

const nodeA = new Node({ id: "1", label: "Node A", x: 50, y: 50 });
const nodeB = new Node({ id: "2", label: "Node B", x: 200, y: 150 });
const nodeC = new Node({ id: "3", label: "Node C", x: 400, y: 300 });
const nodeD = new Node({ id: "4", label: "Node D", x: 600, y: 250 });
const nodeE = new Node({ id: "5", label: "Node E", x: 800, y: 100 });
const nodeF = new Node({ id: "6", label: "Node F", x: 1000, y: 500 });

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);
graph.addNode(nodeD);
graph.addNode(nodeE);
graph.addNode(nodeF);

graph.linkNodes(nodeA, nodeB);
graph.linkNodes(nodeA, nodeC);
graph.linkNodes(nodeA, nodeD);
graph.linkNodes(nodeA, nodeE);

const canvas = document.getElementById("graphCanvas");
const camera = new Camera();
const interactionState = new InteractionState();
const drawer = new CanvasDrawer(canvas, camera, interactionState);
const interaction = new Interaction(canvas, graph, camera, interactionState);

function renderGraph() {
  drawer.draw(graph);
  requestAnimationFrame(renderGraph);
}

renderGraph();
