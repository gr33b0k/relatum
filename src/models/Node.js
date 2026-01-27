export class Node {
  constructor({ id, label }) {
    if (!id) {
      throw new Error("Node must have a valid id.");
    }
    this.id = id;
    this.label = label;
  }
}
