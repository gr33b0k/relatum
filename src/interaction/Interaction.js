export class Interaction {
  #nodeClicked = false;
  #draggingNode = false;
  #isPanning = false;
  #lastScreenX = 0;
  #lastScreenY = 0;
  #startX = 0;
  #startY = 0;

  #pointers = new Map();
  #lastPinchDistance = null;

  canvas = null;
  graph = null;
  camera = null;
  interactionState = null;
  physics = null;

  onNodeSelect = null;
  onConnect = null;

  constructor(canvas, graph, camera, interactionState, physics) {
    this.canvas = canvas;
    this.graph = graph;
    this.camera = camera;
    this.interactionState = interactionState;
    this.physics = physics;

    this.interactionState.onModeChange((mode) => this.#updateCursor(mode));
    this.#initEvents();
  }

  #initEvents() {
    const { canvas } = this;
    canvas.addEventListener("pointerdown", (e) => this.#onPointerDown(e));
    canvas.addEventListener("pointermove", (e) => this.#onPointerMove(e));
    canvas.addEventListener("pointerup", (e) => this.#onPointerUp(e));
    canvas.addEventListener("pointercancel", (e) => this.#onPointerUp(e));

    canvas.addEventListener("wheel", (e) => this.#onWheel(e));
  }

  #updateCursor(mode) {
    switch (mode) {
      case "connect":
        this.canvas.style.cursor = "crosshair";
        break;
      case "delete":
        this.canvas.style.cursor = "not-allowed";
        break;
      case "cursor":
      default:
        this.canvas.style.cursor = "default";
    }
  }

  #onPointerDown(event) {
    event.preventDefault();

    this.canvas.setPointerCapture(event.pointerId);
    this.#pointers.set(event.pointerId, event);

    if (this.#pointers.size === 1) {
      this.#handleSingleDown(event);
    }

    if (this.#pointers.size === 2) {
      const [p1, p2] = [...this.#pointers.values()];
      this.#lastPinchDistance = this.#getPinchDistance(p1, p2);
    }
  }

  #onPointerMove(event) {
    event.preventDefault();

    this.#pointers.set(event.pointerId, event);

    if (this.#pointers.size === 1) {
      this.#handleSingleMove(event);
    }

    if (this.#pointers.size === 2) {
      const [p1, p2] = [...this.#pointers.values()];

      const newDistance = Math.hypot(
        p1.clientX - p2.clientX,
        p1.clientY - p2.clientY,
      );
      const center = this.#getCenter(p1, p2);

      const zoomFactor = newDistance / this.#lastPinchDistance;
      this.camera.zoomAt(center.x, center.y, zoomFactor);

      this.#lastPinchDistance = newDistance;
    }
  }

  #onPointerUp(event) {
    event.preventDefault();

    this.#pointers.delete(event.pointerId);

    if (this.#pointers.size === 1) {
      const [remaining] = this.#pointers.values();

      this.#lastScreenX = remaining.clientX;
      this.#lastScreenY = remaining.clientY;
    }

    if (this.#pointers.size < 2) {
      this.#lastPinchDistance = null;
    }

    if (this.#pointers.size === 0) {
      this.#handleSingleUp(event);
    }

    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
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

  #handleSingleDown(event) {
    const { canvas, camera, graph, interactionState, physics } = this;
    const rect = canvas.getBoundingClientRect();
    const sx = event.clientX - rect.left;
    const sy = event.clientY - rect.top;
    const { x: wx, y: wy } = camera.screenToWorld(sx, sy);

    const clickedNode = graph.getNodeAt(wx, wy);
    if (clickedNode) {
      const mode = interactionState.getMode();

      this.#nodeClicked = true;
      const neighbors = graph
        .getNodeNeighbors(clickedNode)
        .map((n) => n.neighbor);
      switch (mode) {
        case "connect":
          interactionState.startConnection(clickedNode);
          break;
        case "cursor":
          this.#draggingNode = false;

          this.#startX = event.clientX;
          this.#startY = event.clientY;

          interactionState.setSelection(clickedNode, neighbors);
          physics.setDraggedNode(clickedNode);
          break;
        case "delete":
          interactionState.setSelection(clickedNode, neighbors);
          this.onDeleteNode?.(clickedNode);
          break;
      }
    } else {
      interactionState.clearSelection();
    }

    if (
      (event.pointerType === "mouse" && event.button === 1) ||
      (event.pointerType === "touch" && !clickedNode)
    ) {
      this.#isPanning = true;
      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
      canvas.style.cursor = "grabbing";
      return;
    }
  }

  #handleSingleMove(event) {
    const { camera, physics, canvas, interactionState } = this;

    const rect = canvas.getBoundingClientRect();

    if (this.#isPanning) {
      const dx = event.clientX - this.#lastScreenX;
      const dy = event.clientY - this.#lastScreenY;

      camera.pan(dx, dy);

      this.#lastScreenX = event.clientX;
      this.#lastScreenY = event.clientY;
      return;
    }

    if (this.#nodeClicked) {
      const sx = event.clientX - rect.left;
      const sy = event.clientY - rect.top;
      const { x: wx, y: wy } = camera.screenToWorld(sx, sy);
      const mode = interactionState.getMode();
      switch (mode) {
        case "connect":
          interactionState.updateConnectionPreview(wx, wy);
          break;
        case "cursor":
          const dx = event.clientX - this.#startX;
          const dy = event.clientY - this.#startY;
          const distance = Math.hypot(dx, dy);
          if (distance > 3) {
            this.#draggingNode = true;
            physics.setDragTarget(wx, wy);
          }
      }
    }
  }

  #handleSingleUp(event) {
    const { canvas, interactionState, camera } = this;

    if (event.button === 0) {
      const mode = this.interactionState.getMode();
      switch (mode) {
        case "connect":
          const rect = canvas.getBoundingClientRect();
          const sx = event.clientX - rect.left;
          const sy = event.clientY - rect.top;
          const { x: wx, y: wy } = camera.screenToWorld(sx, sy);

          const targetNode = this.graph.getNodeAt(wx, wy);
          const fromNode = interactionState.getConnectingNode();

          this.onConnect?.(fromNode, targetNode);
          interactionState.clearConnectionPreview();
          break;
        case "cursor":
          if (this.#nodeClicked && !this.#draggingNode) {
            this.onNodeSelect?.(interactionState.getSelectedNode());
            return;
          }
          interactionState.clearSelection();
      }
    }

    this.#nodeClicked = false;
    this.#draggingNode = false;
    this.#isPanning = false;
    canvas.style.cursor = "default";
  }

  #getPinchDistance(p1, p2) {
    return Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
  }

  #getCenter(p1, p2) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2,
    };
  }
}
