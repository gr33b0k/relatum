export class Camera {
  constructor() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
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
}
