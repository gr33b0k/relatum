export class SidebarController {
  sidebar = null;
  overlay = null;

  #title = null;
  #description = null;
  #tags = null;
  #nodeSelector = null;

  onNodeChange = null;

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
    this.overlay.addEventListener("click", () => this.close());
    this.#nodeSelector.addEventListener("change", (e) => {
      const nodeId = this.#nodeSelector.value;
      this.onNodeChange?.(nodeId);
    });
  }

  open() {
    this.sidebar.classList.remove("sidebar--hidden");
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.sidebar.classList.add("sidebar--hidden");
    this.overlay.classList.add("hidden");
  }

  setNodes(nodes) {
    this.#nodeSelector.innerHTML = "";

    nodes.forEach((node) => {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = node.label;
      this.#nodeSelector.appendChild(option);
    });
  }

  renderNodeInfo(node) {
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
