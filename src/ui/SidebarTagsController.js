export class SidebarTagsController {
  #input = null;
  #addButton = null;
  #form = null;

  onAddTag = null;

  constructor(root) {
    this.#form = root;
    this.#input = root.querySelector(".sidebar__tags-input");
    this.#addButton = root.querySelector(".sidebar__tags-button");

    this.#init();
  }

  #init() {
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();

      const value = this.#input.value.trim();
      if (!value) return;

      this.onAddTag?.(value);
      this.#input.value = "";
    });
  }
}
