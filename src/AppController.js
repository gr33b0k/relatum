import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./render/CanvasDrawer.js";
import { Camera } from "./models/Camera.js";
import { Interaction } from "./controller/Interaction.js";
import { InteractionState } from "./controller/InteractionState.js";
import { PhysicsEngine } from "./controller/PhysicsEngine.js";

import { SidebarController } from "./ui/SidebarController.js";
import { SidebarSelectController } from "./ui/SidebarSelectController.js";
import { SidebarTagsController } from "./ui/SidebarTagsController.js";
import { SidebarConnectionsController } from "./ui/SidebarConnectionsController.js";

import { SelectionService } from "./services/SelectionService.js";

export class AppController {
  constructor(canvas) {
    this.canvas = canvas;
  }

  start() {
    this.#init();
    this.#renderLoop();
  }

  #init() {
    this.#initCoreClasses();
    this.#initUIElements();
    this.#initUIControllers();
    this.#bindCallbacks();
    this.#bindListeners();
  }

  #initCoreClasses() {
    this.graph = new Graph();
    this.#fillMockData();

    this.camera = new Camera();
    this.interactionState = new InteractionState();
    this.physics = new PhysicsEngine(this.graph);
    this.interaction = new Interaction(
      this.canvas,
      this.graph,
      this.camera,
      this.interactionState,
      this.physics,
    );
    this.drawer = new CanvasDrawer(
      this.canvas,
      this.camera,
      this.interactionState,
    );
  }

  #initUIElements() {
    this.sidebar = document.querySelector(".sidebar");
    this.overlay = document.querySelector(".overlay");
    this.sidebarConnections = this.sidebar.querySelector(
      ".sidebar__connections",
    );
    this.closeSidebarButton = this.sidebar.querySelector(
      ".sidebar__action--close",
    );
    this.sidebarAddTags = this.sidebar.querySelector(".sidebar__tags-add");
    this.selectWrapper = this.sidebar.querySelector(".sidebar__select-wrapper");
  }

  #initUIControllers() {
    this.sidebarSelectController = new SidebarSelectController(
      this.selectWrapper,
      this.graph.getNodesArray().map((node) => ({
        value: node.id,
        text: node.label,
      })),
    );
    this.sidebarTagsController = new SidebarTagsController(this.sidebarAddTags);
    this.sidebarConnectionsController = new SidebarConnectionsController(
      this.sidebarConnections,
    );

    this.sidebarController = new SidebarController(
      this.sidebar,
      this.overlay,
      this.sidebarSelectController,
      this.sidebarConnectionsController,
      this.sidebarTagsController,
    );

    this.selectionService = new SelectionService(
      this.graph,
      this.interactionState,
      this.sidebarController,
      this.sidebarSelectController,
      this.physics,
    );
  }

  #fillMockData() {
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
      x: 50,
      y: 50,
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

    this.graph.addNode(nodeA);
    this.graph.addNode(nodeB);
    this.graph.addNode(nodeC);
    this.graph.addNode(nodeD);
    this.graph.addNode(nodeE);
    this.graph.addNode(nodeF);

    this.graph.linkNodes(nodeA, nodeB);
    this.graph.linkNodes(nodeA, nodeC);
    this.graph.linkNodes(nodeA, nodeD);
    this.graph.linkNodes(nodeE, nodeF);
  }

  #bindCallbacks() {
    this.sidebarController.onDelete = () => {
      const selectedNode = this.interactionState.getSelectedNode();
      const neighbors = this.graph.getNodeNeighbors(selectedNode);

      this.graph.removeNode(selectedNode.id);

      const nodes = this.graph.getNodesArray();
      if (nodes.length === 0) {
        this.sidebarController.close();
        return;
      }

      const nextNode =
        neighbors.length !== 0
          ? neighbors[0].neighbor
          : nodes[Math.floor(Math.random() * nodes.length)];

      this.selectionService.afterDelete(nextNode);
    };

    this.sidebarSelectController.onChange = (id) =>
      this.selectionService.fromConnectionClick(this.graph.getNodeById(id));

    this.sidebarConnectionsController.onConnectionClick = (id) =>
      this.selectionService.fromConnectionClick(this.graph.getNodeById(id));

    this.sidebarTagsController.onAddTag = (tag) => {
      const currentNode = this.interactionState.getSelectedNode();
      const neighbors = this.graph.getNodeNeighbors(currentNode);
      const nodeConnections = this.#mapConnections(neighbors);
      currentNode.addTag(tag);
      this.sidebarController.renderNodeInfo(currentNode, nodeConnections);
    };

    this.interaction.onNodeSelect = (node) =>
      this.selectionService.fromCanvas(node);
  }

  #bindListeners() {
    this.closeSidebarButton.addEventListener("click", () => {
      this.sidebarController.close();
      this.interactionState.clearSelection();
    });

    this.overlay.addEventListener("click", () => {
      this.sidebarController.close();
      this.interactionState.clearSelection();
    });
  }

  #mapConnections(neighbors) {
    return neighbors.map((n) => ({
      id: n.neighbor.id,
      name: n.neighbor.label,
      type: n.type,
    }));
  }

  #renderLoop() {
    const loop = () => {
      this.physics.update();
      this.drawer.draw(this.graph);
      requestAnimationFrame(loop);
    };

    loop();
  }
}
