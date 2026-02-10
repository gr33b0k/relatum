export class InteractionState {
  #selectedNode = null;
  #highlightedNodes = new Set();
  #connectingFrom = null;
  #connectionPreviewPos = null;
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

  startConnection(node) {
    this.#connectingFrom = node;
  }

  updateConnectionPreview(x, y) {
    this.#connectionPreviewPos = { x, y };
  }

  clearConnectionPreview() {
    this.#connectingFrom = null;
    this.#connectionPreviewPos = null;
  }

  getConnectionPreview() {
    if (!this.#connectingFrom || !this.#connectionPreviewPos) return null;
    return {
      from: this.#connectingFrom,
      to: this.#connectionPreviewPos,
    };
  }

  getConnectingNode() {
    return this.#connectingFrom;
  }
}
