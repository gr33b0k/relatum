export class Node {
  constructor({ id, label, x = 0, y = 0, weight = 1, description, tags }) {
    if (!id) {
      throw new Error("Node must have a valid id.");
    }
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.weight = weight;

    this.description = description;
    this.tags = new Set(tags);
  }

  setWeight(weight) {
    this.weight = weight;
  }
}
