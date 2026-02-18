export class Node {
  constructor({ label, x = 0, y = 0, weight = 1, description, tags = [] }) {
    this.id = crypto.randomUUID();
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

  addTag(tag) {
    this.tags.add(tag);
  }
}
