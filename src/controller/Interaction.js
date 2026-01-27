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
    canvas.addEventListener("pointerdown", (e) => this.#onMouseDown(e));
    canvas.addEventListener("pointermove", (e) => this.#onMouseMove(e));
    canvas.addEventListener("pointerup", (e) => this.#onMouseUp(e));
    canvas.addEventListener("wheel", (e) => this.#onWheel(e));
  }

  #onMouseDown(event) {
    event.preventDefault();
    // this.canvas.setPointerCapture(event.pointerId);

    const { canvas, camera, graph } = this;

    const rect = canvas.getBoundingClientRect();
    const sx = event.clientX - rect.left;
    const sy = event.clientY - rect.top;
    const { x: wx, y: wy } = camera.screenToWorld(sx, sy);

    if (event.button === 1) {
      this.#isPanning = true;
      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
      canvas.style.cursor = "grabbing";
    }
  }

  #onMouseMove(event) {
    event.preventDefault();

    const { camera, canvas } = this;

    const rect = canvas.getBoundingClientRect();

    if (this.#isPanning) {
      const dx = event.clientX - this.#lastScreenX;
      const dy = event.clientY - this.#lastScreenY;

      camera.pan(dx, dy);

      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
    }
  }

  #onMouseUp(event) {
    event.preventDefault();

    const { canvas } = this;

    if (event.button === 1) {
      this.#isPanning = false;
      canvas.style.cursor = "default";
    }
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
