import { Graph } from "./models/Graph.js";
import { Node } from "./models/Node.js";
import { CanvasDrawer } from "./render/CanvasDrawer.js";
import { Camera } from "./models/Camera.js";
import { Interaction } from "./interaction/Interaction.js";
import { InteractionState } from "./interaction/InteractionState.js";
import { PhysicsEngine } from "./controller/PhysicsEngine.js";
import { SelectionService } from "./services/SelectionService.js";
import { GraphStorageService } from "./services/GraphStorageService.js";

import { SidebarController } from "./ui/sidebar/SidebarController.js";
import { SidebarTagsController } from "./ui/sidebar/SidebarTagsController.js";
import { SidebarConnectionsController } from "./ui/sidebar/SidebarConnectionsController.js";

import { ToolbarController } from "./ui/toolbar/ToolbarController.js";

import { AddNodeController } from "./ui/modal/AddNodeController.js";
import { ConfirmModalController } from "./ui/modal/ConfirmModalController.js";
import { SidebarDescriptionController } from "./ui/sidebar/SidebarDescriptionController.js";

export class AppController {
  constructor(canvas) {
    this.canvas = canvas;
  }

  start() {
    this.#init();
    this.#renderLoop();
  }

  changeTheme(theme) {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.toggle("light", theme === "light");

    this.darkThemeIcon.classList.toggle("selected", theme === "light");
    this.lightThemeIcon.classList.toggle("selected", theme === "dark");
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
    this.camera = new Camera();
    this.interactionState = new InteractionState();
    this.graphStorage = new GraphStorageService();
    this.#restoreGraph();
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
    this.themeButton = document.querySelector(".button--theme");
    this.darkThemeIcon = this.themeButton.querySelector(".dark-theme");
    this.lightThemeIcon = this.themeButton.querySelector(".light-theme");

    const theme = localStorage.getItem("theme");

    this.darkThemeIcon.classList.toggle("selected", theme === "light");
    this.lightThemeIcon.classList.toggle(
      "selected",
      !theme || theme === "dark",
    );

    this.sidebar = document.querySelector(".sidebar");
    this.overlay = document.querySelector(".overlay");
    this.sidebarConnections = this.sidebar.querySelector(".connections");
    this.sidebarAddTags = this.sidebar.querySelector(".tags__add-section");
    this.sidebarDescription = this.sidebar.querySelector(
      ".sidebar__section--description",
    );
    this.selectWrapper = this.sidebar.querySelector(".select-wrapper");
    this.closeSidebarButton = this.sidebar.querySelector(
      ".sidebar__action--close",
    );

    this.toolbar = document.querySelector(".graph__toolbar");
    this.addNodeModal = document.querySelector('.modal[data-modal="add-node"]');
    this.confirmModal = document.querySelector('.modal[data-modal="confirm"]');
  }

  #initUIControllers() {
    this.sidebarTagsController = new SidebarTagsController(this.sidebarAddTags);
    this.sidebarConnectionsController = new SidebarConnectionsController(
      this.sidebarConnections,
    );
    this.sidebarDescriptionController = new SidebarDescriptionController(
      this.sidebarDescription,
    );

    this.sidebarController = new SidebarController(
      this.sidebar,
      this.overlay,
      this.sidebarConnectionsController,
      this.sidebarTagsController,
      this.sidebarDescriptionController,
    );

    this.selectionService = new SelectionService(
      this.graph,
      this.interactionState,
      this.sidebarController,
      this.physics,
    );

    this.toolbarController = new ToolbarController(this.toolbar);

    this.addNodeModalController = new AddNodeController(this.addNodeModal);
    this.confirmModalController = new ConfirmModalController(this.confirmModal);

    const options = this.graph.getNodesArray().map((node) => ({
      value: node.id,
      text: node.label,
    }));

    this.sidebarController.setSelectOptions(options);
    this.addNodeModalController.setSelectOptions(options);
  }

  #restoreGraph() {
    const graphNodes = this.graphStorage.load();

    if (!graphNodes) return;

    graphNodes.forEach((n) => {
      const node = new Node({
        id: n.id,
        label: n.label,
        x: n.x,
        y: n.y,
        description: n.description,
        tags: n.tags,
      });

      this.graph.addNode(node);
    });

    graphNodes.forEach((n) => {
      const node = this.graph.getNodeById(n.id);
      n.links.forEach(({ id, type }) => {
        const neighborNode = this.graph.getNodeById(id);
        if (type === "source") {
          this.graph.linkNodes(node, neighborNode);
        } else {
          this.graph.linkNodes(neighborNode, node);
        }
      });
    });
  }

  #bindCallbacks() {
    this.interaction.onNodeSelect = (node) =>
      this.selectionService.fromCanvas(node);

    this.interaction.onDeleteNode = async (node) => {
      const confirm = await this.confirmModalController.confirm(
        `Deleting note ${node.label}`,
        `Are you sure you want to delete note ${node.label}`,
      );

      if (confirm) {
        this.graph.removeNode(node.id);
      }

      this.interactionState.clearSelection();
      this.graphStorage.save(this.graph);
    };

    this.interaction.onConnect = (from, target) => {
      if (from && target && from !== target) {
        this.graph.linkNodes(from, target);
        this.graphStorage.save(this.graph);
      }
    };
    this.sidebarController.onDelete = async () => {
      const selectedNode = this.interactionState.getSelectedNode();

      const confirm = await this.confirmModalController.confirm(
        `Deleting note ${selectedNode.label}`,
        `Are you sure you want to delete note ${selectedNode.label}`,
      );

      if (!confirm) {
        return;
      }

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
      this.graphStorage.save(this.graph);
    };

    this.sidebarController.onSelectChange = (id) =>
      this.selectionService.fromSidebarSelect(this.graph.getNodeById(id));

    this.sidebarConnectionsController.onConnectionClick = (id) =>
      this.selectionService.fromConnectionClick(this.graph.getNodeById(id));

    this.sidebarConnectionsController.onDisconnect = (
      nodeToDisconnect,
      type,
    ) => {
      const currentNode = this.interactionState.getSelectedNode().id;

      if (type === "source") {
        this.graph.removeLink(currentNode, nodeToDisconnect);
      } else {
        this.graph.removeLink(nodeToDisconnect, currentNode);
      }

      this.graphStorage.save(this.graph);
    };

    this.sidebarTagsController.onAddTag = (tag) => {
      const currentNode = this.interactionState.getSelectedNode();
      currentNode.addTag(tag);
      this.sidebarController.renderTags(currentNode.tags);
      this.graphStorage.save(this.graph);
    };

    this.sidebarTagsController.onRemoveTag = (tag) => {
      const currentNode = this.interactionState.getSelectedNode();
      currentNode.removeTag(tag);
      this.sidebarController.renderTags(currentNode.tags);
      this.graphStorage.save(this.graph);
    };

    this.sidebarDescriptionController.onDescriptionChange = (description) => {
      const currentNode = this.interactionState.getSelectedNode();

      currentNode.setDescription(description);
      this.graphStorage.save(this.graph);
    };

    this.toolbarController.onModeChange = (mode) => {
      this.interactionState.setMode(mode);
    };

    this.toolbarController.onAddNode = () => {
      this.addNodeModal.showModal();
    };

    this.toolbarController.onSearch = (query, filters) => {
      if (!query) {
        this.interactionState.clearSelection();
        return -1;
      }
      const results = this.graph.getNodesArray().filter((node) => {
        let match = false;

        if (filters.label) {
          match =
            match || node.label.toLowerCase().includes(query.toLowerCase());
        }

        if (filters.tags) {
          match =
            match ||
            [...node.tags].some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase()),
            );
        }

        if (filters.description) {
          match =
            match ||
            node.description.toLowerCase().includes(query.toLowerCase());
        }

        return match;
      });

      this.interactionState.clearSelection();
      this.interactionState.highlightNodes(results);

      return results.length;
    };

    this.addNodeModalController.onSumbit = (data) => {
      const node = new Node({
        label: data.title,
        description: data.description,
        tags: data.tags,
      });
      this.graph.addNode(node);

      data.connections.forEach((connection) => {
        const targetNode = this.graph.getNodeById(connection.value);
        const from = connection.from;
        const to = connection.to;
        if (from) {
          this.graph.linkNodes(targetNode, node);
        }

        if (to) {
          this.graph.linkNodes(node, targetNode);
        }
      });

      const options = this.graph.getNodesArray().map((node) => ({
        value: node.id,
        text: node.label,
      }));

      this.sidebarController.setSelectOptions(options);
      this.addNodeModalController.setSelectOptions(options);
      this.graphStorage.save(this.graph);
    };
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

    this.themeButton.addEventListener("click", () => {
      const isLight = document.documentElement.classList.contains("light");
      this.changeTheme(isLight ? "dark" : "light");
    });
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
