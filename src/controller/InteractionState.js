export class InteractionState {
  #selectedNode = null;
  #highlightedNodes = new Set();

  selectNode(node) {
    this.#selectedNode = node;
  }

  clearAll() {
    this.#selectedNode = null;
    this.#highlightedNodes.clear();
  }

  highlightNode(node) {
    this.#highlightedNodes.add(node);
  }

  getHighlightedNodes() {
    return this.#highlightedNodes;
  }

  getSelectedNode() {
    return this.#selectedNode;
  }
}
