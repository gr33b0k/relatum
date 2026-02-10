export class InteractionState {
  #selectedNode = null;
  #highlightedNodes = new Set();
  #mode = "cursor";

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

  setMode(mode) {
    this.#mode = mode;
  }

  getMode() {
    return this.#mode;
  }
}
