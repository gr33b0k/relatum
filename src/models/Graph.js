import { Link } from "./Link.js";

export class Graph {
  #nodes = new Map();
  #links = [];

  addNode(node) {
    if (this.#nodes.has(node.id)) {
      throw new Error(`Node with id ${node.id} already exists.`);
    }
    this.#nodes.set(node.id, node);
  }

  removeNode(nodeId) {
    if (!this.#nodes.delete(nodeId)) {
      return;
    }

    this.#links = this.#links.filter(
      (link) => link.from.id !== nodeId && link.to.id !== nodeId,
    );

    this.#recalculateNodeWeights();
  }

  getNodesArray() {
    return Array.from(this.#nodes.values());
  }

  getLinks() {
    return this.#links;
  }

  getNodeById(id) {
    if (!this.#nodes.has(id)) {
      throw new ReferenceError(
        'Node with id "' + id + '" does not exist in the graph.',
      );
    }
    return this.#nodes.get(id);
  }

  getNodeAt(x, y) {
    return this.getNodesArray().find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.hypot(dx, dy) <= node.weight * 10;
    });
  }

  linkNodes(from, to) {
    this.#links.push(new Link(from, to));
    this.#recalculateNodeWeights();
  }

  #recalculateNodeWeights() {
    for (let node of this.#nodes.values()) {
      const numLinks = this.#countNodeLinks(node);
      const newWeight = numLinks > 1 ? Math.log(numLinks + 1) : 1;
      node.setWeight(newWeight);
    }
  }

  #countNodeLinks(node) {
    return this.#links.filter(
      (link) => link.from.id === node.id || link.to.id === node.id,
    ).length;
  }

  getNodeNeighbors(node) {
    if (!this.#nodes.has(node.id)) {
      return [];
    }
    return this.#links
      .filter((link) => link.from.id === node.id || link.to.id === node.id)
      .map((link) => {
        return link.from.id === node.id
          ? { neighbor: this.#nodes.get(link.to.id), type: "source" }
          : { neighbor: this.#nodes.get(link.from.id), type: "target" };
      });
  }
}
