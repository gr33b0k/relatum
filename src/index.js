import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./view/CanvasDrawer.js";
import { Camera } from "./view/Camera.js";
import { Interaction } from "./controller/Interaction.js";
import { InteractionState } from "./controller/InteractionState.js";
import { PhysicsEngine } from "./controller/PhysicsEngine.js";

import { SidebarController } from "./ui/SidebarController.js";

const graph = new Graph();

const nodeA = new Node({
  id: "1",
  label: "Node A",
  x: 50,
  y: 50,
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aperiam odit aliquid nesciunt voluptates consequuntur aspernatur, quod nulla cumque. Enim fugit numquam mollitia sequi reiciendis dolorum veritatis vitae amet perferendis?
  Totam repudiandae modi, maiores maxime optio voluptatem iusto unde assumenda quis, commodi voluptas quasi. In, voluptatibus cumque vero debitis commodi eius voluptas sunt facilis saepe, possimus dolore sint, obcaecati illo!
  Dolorum, dicta. Sapiente distinctio rerum molestias quas ratione blanditiis, aut sint aliquam reiciendis eligendi quisquam cupiditate soluta enim commodi, architecto aperiam numquam dolor vero error quasi minima? Magni, itaque sunt.
  Officia, impedit. Neque eveniet corrupti voluptas nesciunt expedita officia incidunt, laborum rem sunt ducimus enim ut est a nam quia. Blanditiis labore vero eaque dolores quam commodi, quasi exercitationem sapiente?
  Odio fugiat eveniet eos consectetur eum excepturi, amet aut, ducimus a, doloremque velit? Aliquam nemo vitae sed magni ducimus nesciunt nulla cum explicabo! Atque perferendis ullam reprehenderit, impedit eius temporibus!
  Unde voluptatibus dolore ex eaque non perferendis, labore debitis. Nesciunt, quis impedit cumque nemo autem ipsum a sunt sed dolorem, soluta totam. Laudantium maiores aperiam harum labore quisquam esse recusandae!`,
  tags: ["frontend", "basics"],
});
const nodeB = new Node({
  id: "2",
  label: "Node B",
  x: 200,
  y: 150,
  description: `Lorem ipsum dolor sit amet consectetur, 
                adipisicing elit. Delectus quam blanditiis, 
                doloremque officia odio aut saepe aspernatur doloribus, 
                explicabo, dolores magni enim quos maxime maiores qui. 
                Excepturi quisquam fugiat veritatis.`,
  tags: ["javascript"],
});
const nodeC = new Node({
  id: "3",
  label: "Node C",
  x: 400,
  y: 300,
  description: `Lorem ipsum dolor sit amet consectetur`,
  tags: ["css"],
});
const nodeD = new Node({
  id: "4",
  label: "Node D",
  x: 600,
  y: 250,
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Vitae ad illum pariatur. Illum, mollitia ducimus! 
                Explicabo provident id eius nobis. 
                Impedit id officia corporis magnam delectus repellat in sit. Expedita?`,
  tags: ["html"],
});
const nodeE = new Node({
  id: "5",
  label: "Node E",
  x: 800,
  y: 100,
  description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                Beatae obcaecati aspernatur dolorum, vitae ab molestiae accusantium voluptas, omnis architecto id minima. 
                Maiores quae delectus deserunt impedit sed sunt non sit?
                Quos, ipsa magni cupiditate ab adipisci nulla nemo dolore quas laudantium molestias, 
                veritatis sit ipsum aspernatur nostrum error sed harum libero quidem veniam, officia corrupti? 
                Doloribus voluptas omnis quo mollitia!`,
  tags: ["python"],
});
const nodeF = new Node({
  id: "6",
  label: "Node F",
  x: 1000,
  y: 500,
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Eius, debitis asperiores. Officiis, sequi amet? 
                Laudantium in ducimus dolores voluptates vero aspernatur fugit repellat iure. 
                Illo, dolorum error. Magni, placeat! Officia!`,
  tags: ["backend", "basics"],
});

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);
graph.addNode(nodeD);
graph.addNode(nodeE);
graph.addNode(nodeF);

graph.linkNodes(nodeA, nodeB);
graph.linkNodes(nodeA, nodeC);
graph.linkNodes(nodeA, nodeD);
graph.linkNodes(nodeE, nodeF);

const canvas = document.getElementById("graphCanvas");
const camera = new Camera();
const interactionState = new InteractionState();
const physics = new PhysicsEngine(graph);
const drawer = new CanvasDrawer(canvas, camera, interactionState);
const interaction = new Interaction(
  canvas,
  graph,
  camera,
  interactionState,
  physics,
);

const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const sidebarTitle = sidebar.querySelector(".sidebar__title");
const sidebarDescription = sidebar.querySelector(".sidebar__description-text");
const sidebarTags = sidebar.querySelector(".sidebar__tag-list");
const sidebarSelector = document.getElementById("sidebar-node-select");
const closeSidebarButton = document.getElementById("closeSidebar");
const sidebarController = new SidebarController(
  sidebar,
  overlay,
  sidebarTitle,
  sidebarDescription,
  sidebarTags,
  sidebarSelector,
);

sidebar.addEventListener("sidebarNodeSelected", (e) => {
  console.log(e);
  const nodeId = e.detail.nodeId;
  const node = graph.getNodeById(nodeId);
  sidebarController.fillInfo(node);
});

sidebarController.setNodes(graph.getNodesArray());

interaction.onNodeSelect = (selectedNode) => {
  sidebarController.changeState(selectedNode);
};

closeSidebarButton.addEventListener("click", () =>
  sidebarController.changeState(),
);

function renderGraph() {
  physics.update();
  drawer.draw(graph);
  requestAnimationFrame(renderGraph);
}

renderGraph();
