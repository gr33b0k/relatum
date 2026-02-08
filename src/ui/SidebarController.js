export class SidebarController {
  sidebar = null;
  overlay = null;
  #title = null;
  #description = null;
  #deleteButton = null;

  #selectController = null;
  #connectionsController = null;
  #tagsController = null;

  onDelete = null;

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
    this.#deleteButton = sidebar.querySelector(".sidebar__action--delete");

    this.#deleteButton.addEventListener("click", () => this.onDelete?.());

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
    this.renderLabel(node.label);
    this.setSelect(node.id);
    this.renderConnections(connections);
    this.renderTags(node.tags);
    this.renderDescription(
      node.description ? node.description : "This node have no description",
    );
  }

  renderLabel(label) {
    this.#title.textContent = label;
  }

  setSelect(id) {
    this.#selectController.setValue(id);
  }

  renderConnections(connections) {
    this.#connectionsController.setConnections(connections);
  }

  renderTags(tags) {
    this.#tagsController.renderTags(tags);
  }

  renderDescription(text) {
    this.#description.textContent = text;
  }
}
