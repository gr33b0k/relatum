export class Node {
  constructor({ id, label, x = 0, y = 0, weight = 1, description, tags = [] }) {
    this.id = id ? id : crypto.randomUUID();
    this.label = label;
    this.x = x ? x : Math.random() * 500;
    this.y = y ? y : Math.random() * 500;
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

  setDescription(description) {
    this.description = description;
  }

  removeTag(tag) {
    this.tags.delete(tag);
  }
}
