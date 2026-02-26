import { ToolbarSearch } from "./ToolbarSearch.js";

export class ToolbarController {
  onAddNode = null;
  onSearch = null;
  onModeChange = null;

  constructor(toolbar) {
    this.toolbar = toolbar;
    this.searchSection = toolbar.querySelector(".toolbar__search");
    this.toolbarSearch = new ToolbarSearch(this.searchSection);
    this.toolbarSearch.onSearch = (query) => {
      this.onSearch?.(query);
    };
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
      case "connect":
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
      case "clear":
        this.buttons.forEach((button) =>
          button.classList.remove("toolbar__button--active"),
        );
        break;
    }
  }

  #initEvents() {
    this.linkButton.addEventListener("click", () => {
      this.#setActiveMode("connect");
      this.onModeChange?.("connect");
      this.toolbarSearch.close();
      this.#setSearch();
    });

    this.cursorButton.addEventListener("click", () => {
      this.#setActiveMode("cursor");
      this.onModeChange?.("cursor");
      this.toolbarSearch.close();
      this.#setSearch();
    });

    this.deleteNodeButton.addEventListener("click", () => {
      this.#setActiveMode("delete");
      this.onModeChange?.("delete");
      this.toolbarSearch.close();
      this.#setSearch();
    });

    this.addNodeButton.addEventListener("click", () => {
      this.onModeChange?.("cursor");
      this.onAddNode?.();
    });

    this.searchButton.addEventListener("click", () => {
      this.toolbarSearch.toggle();
      this.#setSearch();
      this.onModeChange?.("cursor");
      this.onSearch?.();
    });
  }

  #setSearch() {
    if (this.toolbarSearch.isOpen()) {
      this.#setActiveMode("search");
      this.searchButton.innerHTML = `
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path 
              d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
            ></path>
          </svg>`;
    } else {
      this.#setActiveMode("clear");
      this.searchButton.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path
              d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
            ></path>
          </svg>`;
    }
  }
}
