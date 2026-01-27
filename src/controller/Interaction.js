export class Interaction {
  #isMovingNode = false;
  #isPanning = false;
  #lastScreenX = 0;
  #lastScreenY = 0;

  canvas = null;
  graph = null;
  camera = null;

  constructor(canvas, graph, camera) {
    this.canvas = canvas;
    this.graph = graph;
    this.camera = camera;

    this.#initEvents();
  }

  #initEvents() {
    const { canvas } = this;
    canvas.addEventListener("wheel", (e) => this.#onWheel(e));
  }

  #onWheel(event) {
    event.preventDefault();

    const { canvas, camera } = this;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    camera.zoomAt(x, y, event.deltaY < 0 ? 1.1 : 0.9);
  }
}
