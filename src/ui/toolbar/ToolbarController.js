export class ToolbarController {
  onAddNode = null;
  onSearch = null;
  onModeChange = null;

  constructor(toolbar) {
    this.toolbar = toolbar;
    [
      this.linkButton,
      this.cursorButton,
      this.addNodeButton,
      this.deleteNodeButton,
      this.searchButton,
    ] = toolbar.querySelectorAll(".toolbar__button");

    this.#initEvents();
  }

  #initEvents() {
    this.linkButton.addEventListener("click", () =>
      this.onModeChange?.("connect"),
    );
    this.cursorButton.addEventListener("click", () =>
      this.onModeChange?.("cursor"),
    );
    this.deleteNodeButton.addEventListener("click", () =>
      this.onModeChange?.("delete"),
    );

    this.addNodeButton.addEventListener("click", () => {
      this.onModeChange?.("cursor");
      this.onAddNode?.();
    });

    this.searchButton.addEventListener("click", () => {
      this.onModeChange?.("cursor");
      this.onSearch?.();
    });
  }
}
