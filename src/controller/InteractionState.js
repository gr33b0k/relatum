export class InteractionState {
  #selectedNode = null;
  #highlightedNodes = new Set();

  setSelection(node, neighbors) {
    this.#selectedNode = node;
    this.#highlightedNodes.clear();

    neighbors.forEach((neighbor) => this.#highlightedNodes.add(neighbor));
  }

  clearSelection() {
    this.#selectedNode = null;
    this.#highlightedNodes.clear();
  }

  getHighlightedNodes() {
    return this.#highlightedNodes;
  }

  getSelectedNode() {
    return this.#selectedNode;
  }
}
