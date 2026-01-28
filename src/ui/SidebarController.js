export class SidebarController {
  constructor(sidebar, overlay) {
    this.sidebar = sidebar;
    this.overlay = overlay;

    this.#init();
  }

  #init() {
    this.overlay.addEventListener("click", () => this.changeState());
  }

  changeState() {
    this.sidebar.classList.toggle("sidebar--hidden");
    this.overlay.classList.toggle("hidden");
  }
}
