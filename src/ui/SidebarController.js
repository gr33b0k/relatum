export class SidebarController {
  sidebar = null;
  overlay = null;

  #title = null;
  #description = null;
  #tags = null;
  #nodeSelector = null;

  constructor(sidebar, overlay, title, description, tags, nodeSelector) {
    this.sidebar = sidebar;
    this.overlay = overlay;

    this.#title = title;
    this.#description = description;
    this.#tags = tags;
    this.#nodeSelector = nodeSelector;

    this.#init();
  }

  #init() {
    this.overlay.addEventListener("click", () => this.changeState());
  }

  changeState(selectedNode) {
    this.sidebar.classList.toggle("sidebar--hidden");
    this.overlay.classList.toggle("hidden");
    if (!selectedNode) {
      return;
    }
    this.#renderNodeInfo(selectedNode);

  setNodes(nodes) {
    this.#nodeSelector.innerHTML = "";

    nodes.forEach((node) => {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = node.label;
      this.#nodeSelector.appendChild(option);
    });
  }

  #renderNodeInfo(node) {
    this.#title.textContent = node.label;
    this.#description.textContent = node.description
      ? node.description
      : "This node have no description";

    this.#tags.innerHTML = "";
    node.tags.forEach(this.#renderNodeTag);
  }

  #renderNodeTag = (tag) => {
    const li = document.createElement("li");
    li.className = "tag";
    li.textContent = tag;
    this.#tags.appendChild(li);
  };
}
