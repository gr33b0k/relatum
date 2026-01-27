export class Node {
  constructor({ id, label, weight = 1 }) {
    if (!id) {
      throw new Error("Node must have a valid id.");
    }
    this.id = id;
    this.label = label;
  }
}
