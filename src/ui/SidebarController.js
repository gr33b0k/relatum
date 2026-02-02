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
  }

  open() {
    this.sidebar.classList.remove("sidebar--hidden");
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.sidebar.classList.add("sidebar--hidden");
    this.overlay.classList.add("hidden");
  }

  renderNodeInfo(node) {
    this.#title.textContent = node.label;
    this.#description.textContent = node.description
      ? node.description
      : "This node have no description";

    this.#tags.innerHTML = "";
    node.tags.forEach(this.#renderNodeTag);

    this.#nodeSelector.setValue(node.id);
  }

  #renderNodeTag = (tag) => {
    const li = document.createElement("li");
    li.className = "sidebar__tag";
    li.textContent = tag;
    this.#tags.appendChild(li);
  };
}
