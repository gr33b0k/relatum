export class SelectionService {
  #graph = null;
  #interactionState = null;
  #sidebarController = null;
  #sidebarSelectController = null;
  #physics = null;

  constructor(
    graph,
    interactionState,
    sidebarController,
    sidebarSelectController,
    physics,
  ) {
    this.#graph = graph;
    this.#interactionState = interactionState;
    this.#sidebarController = sidebarController;
    this.#sidebarSelectController = sidebarSelectController;
    this.#physics = physics;
  }

  fromCanvas(node) {
    this.#focusNode(node, {
      updateSelection: true,
      openSidebar: true,
      releaseDrag: true,
    });
  }

  fromSidebarSelect(node) {
    this.#focusNode(node, {
      updateSelection: true,
    });
  }

  fromConnectionClick(node) {
    this.#focusNode(node, {
      updateSelection: true,
    });
  }

  afterDelete(node) {
    this.#focusNode(node, {
      updateSelection: true,
      updateSelectOptions: true,
    });
  }

  #focusNode(
    node,
    {
      updateSelection = false,
      openSidebar = false,
      updateSelectOptions = false,
      releaseDrag = false,
    } = {},
  ) {
    if (!node) return;

    const neighbors = this.#graph.getNodeNeighbors(node);
    const neighborsNodes = neighbors.map((n) => n.neighbor);
    const nodeConnections = this.#mapConnections(neighbors);

    if (updateSelection) {
      this.#interactionState.setSelection(node, neighborsNodes);
    }

    if (updateSelectOptions) {
      this.#sidebarSelectController.setOptions(
        this.#graph.getNodesArray().map((node) => ({
          value: node.id,
          text: node.label,
        })),
      );
    }

    if (openSidebar) {
      this.#sidebarController.open();
    }

    if (releaseDrag) {
      this.#physics.releaseDraggedNode();
    }

    this.#sidebarController.renderNodeInfo(node, nodeConnections);
  }

  #mapConnections(neighbors) {
    return neighbors.map((n) => ({
      id: n.neighbor.id,
      name: n.neighbor.label,
      type: n.type,
    }));
  }
}
