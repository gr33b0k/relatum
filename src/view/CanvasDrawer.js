export class CanvasDrawer {
  constructor(canvas, camera, interactionState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
    this.interactionState = interactionState;

    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    const { canvas } = this;
    const rect = canvas.parentElement.getBoundingClientRect();
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

  applyCamera() {
    const { scale, offsetX, offsetY } = this.camera;
    const dpr = window.devicePixelRatio || 1;

    this.ctx.setTransform(
      dpr * scale,
      0,
      0,
      dpr * scale,
      -offsetX * dpr * scale,
      -offsetY * dpr * scale,
    );
  }

  drawNode(node) {
    const { ctx, interactionState } = this;
    const selectedNode = interactionState.getSelectedNode();
    const highlightedNodes = interactionState.getHighlightedNodes();
    if (selectedNode && selectedNode !== node && !highlightedNodes.has(node)) {
      ctx.fillStyle = "#9ac0b7ff";
    } else {
      ctx.fillStyle = "#63c6af";
    }
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
    this.applyCamera();
    graph.getLinks().forEach((link) => this.drawLink(link));
    graph.getNodesArray().forEach((node) => this.drawNode(node));
  }
}
