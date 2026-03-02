export class GraphStorageService {
  save(graph) {
    const data = graph.getNodesArray().map((node) => ({
      id: node.id,
      label: node.label,
      tags: [...node.tags],
      description: node.description,
      x: node.x,
      y: node.y,
      links: graph
        .getNodeNeighbors(node)
        .map((n) => ({ id: n.neighbor.id, type: n.type })),
    }));
    console.log("Saving: ", data);

    localStorage.setItem("graph", JSON.stringify(data));
  }

  load() {
    const data = localStorage.getItem("graph");

    if (!data) return null;

    return JSON.parse(data);
  }
}
