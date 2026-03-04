export class SidebarTagsController {
  #input = null;
  #form = null;

  onAddTag = null;
  onRemoveTag = null;

  constructor(root) {
    this.#form = root;
    this.#input = root.querySelector(".tags__input");

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

  renderTags(tags) {
    const tagsList = this.#form.previousElementSibling;
    tagsList.innerHTML = "";

    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.className = "tag";

      const tagText = document.createElement("span");
      tagText.textContent = tag;
      li.appendChild(tagText);

      const removeButton = document.createElement("button");
      removeButton.className = "tag__remove";
      removeButton.type = "button";
      li.appendChild(removeButton);

      removeButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.onRemoveTag?.(tag);
      });

      tagsList.appendChild(li);
    });
  }
}
