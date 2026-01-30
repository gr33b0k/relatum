export class SidebarController {
  sidebar = null;
  overlay = null;

  #title = null;
  #description = null;
  #tags = null;

  constructor(sidebar, overlay) {
    this.sidebar = sidebar;
    this.overlay = overlay;

    this.#title = sidebar.querySelector(".sidebar__title");
    this.#description = sidebar.querySelector(".sidebar__description-text");
    this.#tags = sidebar.querySelector(".sidebar__tag-list");

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
