export class SidebarController {
  sidebar = null;
  overlay = null;
  #title = null;
  #description = null;

  #selectController = null;
  #connectionsController = null;
  #tagsController = null;

  constructor(
    sidebar,
    overlay,
    selectController,
    connectionsController,
    tagsController,
  ) {
    this.sidebar = sidebar;
    this.overlay = overlay;
    this.#title = sidebar.querySelector(".sidebar__title");
    this.#description = sidebar.querySelector(".sidebar__description-text");

    this.#selectController = selectController;
    this.#connectionsController = connectionsController;
    this.#tagsController = tagsController;
  }

  open() {
    this.sidebar.classList.remove("sidebar--hidden");
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.sidebar.classList.add("sidebar--hidden");
    this.overlay.classList.add("hidden");
  }

  renderNodeInfo(node, connections) {
    this.#title.textContent = node.label;

    this.#selectController.setValue(node.id);
    this.#connectionsController.setConnections(connections);
    this.#tagsController.renderTags(node.tags);
    this.#description.textContent = node.description
      ? node.description
      : "This node have no description";
  }
}
