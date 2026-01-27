export class Node {
  constructor({ id, label, x = 0, y = 0, weight = 1 }) {
    if (!id) {
      throw new Error("Node must have a valid id.");
    }
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.weight = weight;
  }
}
