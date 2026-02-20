export class SelectController {
  #selectWrapper = null;
  #selectButton = null;
  #selectedValue = null;
  #selectOptionsContainer = null;
  #selectOptions = null;
  onChange = null;
  renderButton = null;

  constructor(selectWrapper, options, { onChange, renderButton } = {}) {
    this.#selectWrapper = selectWrapper;
    this.#selectButton = selectWrapper.querySelector(".select");
    this.#selectedValue = this.#selectButton.querySelector(".selected-value");
    this.#selectOptionsContainer =
      selectWrapper.querySelector(".select__options");

    this.onChange = onChange;
    this.renderButton = renderButton;

    this.#init(options);
  }

  #init(options) {
    this.setOptions(options);

    document.addEventListener("pointerdown", (e) => {
      if (!this.#selectWrapper.contains(e.target)) {
        this.close();
      }
    });
    this.#selectButton.addEventListener("click", () => {
      this.toggle();
    });
  }

  open() {
    this.#selectButton.setAttribute("aria-expanded", "true");
    this.#selectOptionsContainer.classList.remove("hidden");
    this.renderButton?.(true, this.#selectButton);
  }

  close() {
    this.#selectButton.setAttribute("aria-expanded", "false");
    this.#selectOptionsContainer.classList.add("hidden");
    this.renderButton?.(false, this.#selectButton);
  }

  toggle() {
    const isOpen = this.#selectButton.getAttribute("aria-expanded") === "true";
    isOpen ? this.close() : this.open();
  }

  setOptions(options) {
    this.#selectOptionsContainer.innerHTML = "";

    options.forEach((option) => {
      const optionElement = document.createElement("li");
      optionElement.dataset.value = option.value;
      optionElement.textContent = option.text;
      optionElement.addEventListener("click", (e) => {
        this.onChange?.(option);
        this.close();
      });
      this.#selectOptionsContainer.appendChild(optionElement);
    });

    this.#selectOptions = this.#selectOptionsContainer.querySelectorAll("li");
  }

  setValue(value) {
    const option = this.#selectOptionsContainer.querySelector(
      `li[data-value="${value}"]`,
    );

    this.#selectOptions.forEach((option) => {
      option.classList.remove("selected");
    });
    option.classList.add("selected");

    if (this.#selectedValue) {
      this.#selectedValue.textContent = option.textContent;
    }
  }
}
