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

  linkNodes(from, to, options) {
    this.#links.push(new Link(from, to, options));
  }
}
