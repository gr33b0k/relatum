export class Camera {
  constructor() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  getViewportWorldBounds(viewWidth, viewHeight) {
    return {
      xMin: this.screenToWorld(0, 0).x,
      yMin: this.screenToWorld(0, 0).y,
      xMax: this.screenToWorld(viewWidth, viewHeight).x,
      yMax: this.screenToWorld(viewWidth, viewHeight).y,
    };
  }

  screenToWorld(sx, sy) {
    return {
      x: sx / this.scale + this.offsetX,
      y: sy / this.scale + this.offsetY,
    };
  }

  zoomAt(screenX, screenY, zoomFactor) {
    const before = this.screenToWorld(screenX, screenY);

    this.scale *= zoomFactor;

    const after = this.screenToWorld(screenX, screenY);

    this.offsetX += before.x - after.x;
    this.offsetY += before.y - after.y;
  }

  pan(dx, dy) {
    this.offsetX -= dx / this.scale;
    this.offsetY -= dy / this.scale;
  }
}
