export class CanvasDrawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.resize();
  }

  resize() {
    const { canvas } = this;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }

  clear() {
    const { ctx, canvas } = this;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawNode(node) {
    const { ctx } = this;
    ctx.fillStyle = "#63c6af";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.weight * 10, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawLink(link) {
    const { ctx } = this;
    ctx.strokeStyle = "#888";
    ctx.beginPath();
    ctx.moveTo(link.from.x, link.from.y);
    ctx.lineTo(link.to.x, link.to.y);
    ctx.stroke();
  }

  draw(graph) {
    this.clear();
    graph.getLinks().forEach((link) => this.drawLink(link));
    graph.getNodesArray().forEach((node) => this.drawNode(node));
  }
}
