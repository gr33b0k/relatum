export class Interaction {
  #nodeClicked = false;
  #draggingNode = false;
  #isPanning = false;
  #lastScreenX = 0;
  #lastScreenY = 0;
  #startX = 0;
  #startY = 0;

  canvas = null;
  graph = null;
  camera = null;
  interactionState = null;
  physics = null;

  onNodeSelect = null;

  constructor(canvas, graph, camera, interactionState, physics) {
    this.canvas = canvas;
    this.graph = graph;
    this.camera = camera;
    this.interactionState = interactionState;
    this.physics = physics;

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

    const { canvas, camera, graph, interactionState, physics } = this;

    this.canvas.setPointerCapture(event.pointerId);

    const rect = canvas.getBoundingClientRect();
    const sx = event.clientX - rect.left;
    const sy = event.clientY - rect.top;
    const { x: wx, y: wy } = camera.screenToWorld(sx, sy);

    if (event.button === 0) {
      const clickedNode = graph.getNodeAt(wx, wy);

      if (clickedNode) {
        this.#nodeClicked = true;
        this.#draggingNode = false;

        this.#startX = event.clientX;
        this.#startY = event.clientY;

        const neighbors = graph
          .getNodeNeighbors(clickedNode)
          .map((n) => n.neighbor);

        interactionState.setSelection(clickedNode, neighbors);
        physics.setDraggedNode(clickedNode);
      } else {
        interactionState.clearSelection();
      }
    }

    if (event.button === 1) {
      this.#isPanning = true;
      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
      canvas.style.cursor = "grabbing";
    }
  }

  #onMouseMove(event) {
    event.preventDefault();

    const { camera, physics, canvas } = this;

    const rect = canvas.getBoundingClientRect();

    if (this.#isPanning) {
      const dx = event.clientX - this.#lastScreenX;
      const dy = event.clientY - this.#lastScreenY;

      camera.pan(dx, dy);

      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
    }

    if (this.#nodeClicked) {
      const sx = event.clientX - rect.left;
      const sy = event.clientY - rect.top;
      const { x: wx, y: wy } = camera.screenToWorld(sx, sy);
      const dx = event.clientX - this.#startX;
      const dy = event.clientY - this.#startY;
      const distance = Math.hypot(dx, dy);
      if (distance > 3) {
        this.#draggingNode = true;
        physics.setDragTarget(wx, wy);
      }
    }
  }

  #onMouseUp(event) {
    event.preventDefault();

    const { canvas, interactionState } = this;

    if (event.button === 0) {
      if (this.#nodeClicked && !this.#draggingNode) {
        this.onNodeSelect?.(interactionState.getSelectedNode());
        return;
      }
      this.#nodeClicked = false;
      this.#draggingNode = false;
      interactionState.clearSelection();
    }

    if (event.button === 1) {
      this.#isPanning = false;
      canvas.style.cursor = "default";
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
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
