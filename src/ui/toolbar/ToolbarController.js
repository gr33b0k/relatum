export class ToolbarController {
  onAddNode = null;
  onSearch = null;
  onModeChange = null;

  constructor(toolbar) {
    this.toolbar = toolbar;
    this.buttons = toolbar.querySelectorAll(".toolbar__button");
    this.linkButton = this.toolbar.querySelector(
      ".toolbar__button--link-nodes",
    );
    this.cursorButton = this.toolbar.querySelector(".toolbar__button--cursor");
    this.deleteNodeButton = this.toolbar.querySelector(
      ".toolbar__button--delete-node",
    );
    this.addNodeButton = this.toolbar.querySelector(
      ".toolbar__button--add-node",
    );
    this.searchButton = this.toolbar.querySelector(".toolbar__button--search");
    this.#initEvents();
  }

  #setActiveMode(mode) {
    this.buttons.forEach((button) =>
      button.classList.remove("toolbar__button--active"),
    );

    switch (mode) {
      case "link":
        this.linkButton.classList.add("toolbar__button--active");
        break;
      case "cursor":
        this.cursorButton.classList.add("toolbar__button--active");
        break;
      case "delete":
        this.deleteNodeButton.classList.add("toolbar__button--active");
        break;
      case "search":
        this.searchButton.classList.add("toolbar__button--active");
        break;
    }
  }

  #initEvents() {
    this.linkButton.addEventListener("click", () => {
      this.#setActiveMode("link");
      this.onModeChange?.("connect");
    });

    this.cursorButton.addEventListener("click", () => {
      this.#setActiveMode("cursor");
      this.onModeChange?.("cursor");
    });

    this.deleteNodeButton.addEventListener("click", () => {
      this.#setActiveMode("delete");
      this.onModeChange?.("delete");
    });

    this.addNodeButton.addEventListener("click", () => {
      this.onModeChange?.("cursor");
      this.onAddNode?.();
    });

    this.searchButton.addEventListener("click", () => {
      this.#setActiveMode("search");
      this.onModeChange?.("cursor");
      this.onSearch?.();
    });
  }
}
