export class PhysicsEngine {
  graph = null;
  #draggedNode = null;
  #targetX = 0;
  #targetY = 0;

  constructor(graph) {
    this.graph = graph;
  }

  setDraggedNode(node) {
    this.#draggedNode = node;
    node.vx = 0;
    node.vy = 0;
    this.setDragTarget(node.x, node.y);
  }

  setDragTarget(x, y) {
    this.#targetX = x;
    this.#targetY = y;
  }

  releaseDraggedNode() {
    this.#draggedNode = null;
  }

  update() {
    const nodes = this.graph.getNodesArray();
    const repelRadius = 80;
    const repelStrength = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelRadius) {
          const t = 1 - dist / repelRadius;
          const force = t * repelStrength;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }
    }

    if (this.#draggedNode) {
      const neighbors = this.graph.getNodeNeighbors(this.#draggedNode);
      neighbors.forEach((n) => {
        const node = n.neighbor;
        const dx = this.#draggedNode.x - node.x;
        const dy = this.#draggedNode.y - node.y;

        node.vx += dx * 0.01;
        node.vy += dy * 0.01;
      });

      this.#draggedNode.x += (this.#targetX - this.#draggedNode.x) * 0.5;
      this.#draggedNode.y += (this.#targetY - this.#draggedNode.y) * 0.5;
    }

    nodes.forEach((n) => {
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    });
  }
}
