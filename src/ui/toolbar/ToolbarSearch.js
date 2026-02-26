export class ToolbarSearch {
  onSearch = null;

  constructor(searchSection) {
    this.searchSection = searchSection;
    this.searchInput = this.searchSection.querySelector(
      ".toolbar__search-input",
    );
    this.clearButton = this.searchSection.querySelector(
      ".toolbar__search-clear",
    );
    this.#initEvents();
  }

  #initEvents() {
    this.searchInput.addEventListener("input", () => {
      const query = this.searchInput.value.trim();
      this.onSearch?.(query);
    });

    this.clearButton.addEventListener("click", () => {
      this.searchInput.value = "";
      this.onSearch?.("");
    });
  }

  open() {
    this.searchSection.classList.remove("hidden");
    this.searchInput.focus();
  }

  close() {
    this.searchSection.classList.add("hidden");
    this.searchInput.value = "";
  }

  isOpen() {
    return !this.searchSection.classList.contains("hidden");
  }

  toggle() {
    if (this.searchSection.classList.contains("hidden")) {
      this.open();
    } else {
      this.close();
    }
  }
}
