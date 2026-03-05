import { SelectController } from "../select/SelectController.js";

export class SidebarController {
  sidebar = null;
  overlay = null;
  #title = null;
  #descriptionController = null;
  #deleteButton = null;

  #selectController = null;
  #connectionsController = null;
  #tagsController = null;

  onDelete = null;
  onSelectChange = null;
  onDescriptionChange = null;

  constructor(
    sidebar,
    overlay,
    connectionsController,
    tagsController,
    descriptionController,
  ) {
    this.sidebar = sidebar;
    this.overlay = overlay;
    this.#title = this.sidebar.querySelector(".sidebar__title");

    this.#deleteButton = this.sidebar.querySelector(".sidebar__action--delete");

    this.#deleteButton.addEventListener("click", () => this.onDelete?.());

    this.#selectController = new SelectController(
      this.sidebar.querySelector(".select-wrapper"),
      [],
      {
        onChange: (option) => this.onSelectChange?.(option.value),
      },
    );
    this.#connectionsController = connectionsController;
    this.#tagsController = tagsController;
    this.#descriptionController = descriptionController;
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
    this.#connectionsController.setCurrentNote(node.id);

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

  renderDescription(description) {
    this.#descriptionController.renderDescription(description);
  }

  setSelectOptions(options) {
    this.#selectController.setOptions(options);
  }
}
