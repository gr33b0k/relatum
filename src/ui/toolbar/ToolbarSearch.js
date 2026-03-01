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

    this.filterElements =
      this.searchSection.querySelectorAll(".toolbar__filter");
    this.#initEvents();
  }

  #initEvents() {
    this.searchInput.addEventListener("input", () => {
      const query = this.searchInput.value.trim();
      this.onSearch?.(query, this.#getFilters());
    });

    this.clearButton.addEventListener("click", () => {
      this.searchInput.value = "";
      this.onSearch?.("", {});
    });
  }

  #getFilters() {
    const filters = {};
    this.filterElements.forEach((filter) => {
      const checkbox = filter.querySelector(".checkbox__input");
      const filterType = checkbox.dataset.filter;

      if (checkbox.checked) {
        filters[filterType] = true;
      }
    });
    return filters;
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
