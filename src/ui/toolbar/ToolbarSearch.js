export class ToolbarSearch {
  onSearch = null;

  constructor(searchSection) {
    this.searchSection = searchSection;
    this.searchHeader = this.searchSection.querySelector(
      ".toolbar__search-header",
    );
    this.searchResults = this.searchHeader.querySelector(
      ".toolbar__search-results",
    );
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
      const count = this.onSearch?.(query, this.#getFilters());
      this.#updateResults(count);
    });

    this.clearButton.addEventListener("click", () => {
      this.searchInput.value = "";
      this.onSearch?.("", {});
      this.#updateResults(-1);
    });

    this.filterElements.forEach((filter) => {
      const checkbox = filter.querySelector(".checkbox__input");

      checkbox.addEventListener("change", (e) => {
        const query = this.searchInput.value.trim();
        const count = this.onSearch?.(query, this.#getFilters());
        this.#updateResults(count);
      });
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

  #updateResults(count) {
    if (count === -1) {
      this.searchHeader.classList.add("hidden");
      return;
    }
    this.searchHeader.classList.remove("hidden");
    if (count !== 0) {
      this.searchResults.textContent = `Found ${count} notes`;
    } else {
      this.searchResults.textContent = `Nothing found`;
    }
  }

  open() {
    this.searchSection.classList.remove("hidden");
    this.searchInput.focus();
  }

  close() {
    this.searchHeader.classList.add("hidden");
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
