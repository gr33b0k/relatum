export class SidebarSelectController {
  #selectWrapper = null;
  #selectButton = null;
  #selectedValue = null;
  #selectOptionsContainer = null;
  #selectOptions = null;
  onChange = null;

  constructor(selectWrapper, options, { onChange } = {}) {
    this.#selectWrapper = selectWrapper;
    this.#selectButton = selectWrapper.querySelector(".sidebar__select");
    this.#selectedValue = this.#selectButton.querySelector(".selected-value");
    this.#selectOptionsContainer = selectWrapper.querySelector(
      ".sidebar__select-options",
    );

    this.onChange = onChange;

    this.#init(options);
  }

  #init(options) {
    this.setOptions(options);

    this.#selectOptions = this.#selectOptionsContainer.querySelectorAll("li");

    document.addEventListener("pointerdown", (e) => {
      if (!this.#selectWrapper.contains(e.target)) {
        this.#toggleOptions(false);
      }
    });
    this.#selectButton.addEventListener("click", () => {
      this.#toggleOptions();
    });
    this.#selectOptions.forEach((option) =>
      option.addEventListener("click", (e) =>
        this.onChange?.(option.dataset.value),
      ),
    );
  }

  #toggleOptions(expand = null) {
    const isOpen =
      expand !== null
        ? expand
        : this.#selectOptionsContainer.classList.contains("hidden");
    this.#selectOptionsContainer.classList.toggle("hidden", !isOpen);
    this.#selectButton.setAttribute("aria-expanded", isOpen);
  }

  setOptions(options) {
    this.#selectOptionsContainer.innerHTML = "";

    options.forEach((option) => {
      const optionElement = document.createElement("li");
      optionElement.dataset.value = option.value;
      optionElement.textContent = option.text;
      this.#selectOptionsContainer.appendChild(optionElement);
    });
  }

  setValue(value) {
    const option = this.#selectOptionsContainer.querySelector(
      `li[data-value="${value}"]`,
    );

    this.#selectOptions.forEach((option) => {
      option.classList.remove("selected");
    });
    option.classList.add("selected");

    this.#selectedValue.textContent = option.textContent;
    this.#toggleOptions(false);
  }
}
