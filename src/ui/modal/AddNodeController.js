import { SelectController } from "../select/SelectController.js";

export class AddNodeController {
  #resetButton = null;

  #modalForm = null;
  #noteTitle = null;
  #connectionList = null;
  #selectController = null;
  #tagsList = null;
  #tagsInput = null;
  #addTagButton = null;
  #description = null;

  #tags = new Set();
  #connections = new Set();
  #allOptions = [];

  onSumbit = null;

  constructor(modal) {
    let isPointerDownOnDialog = false;

    modal.addEventListener("pointerdown", (e) => {
      isPointerDownOnDialog = e.target !== modal;
    });

    modal.addEventListener("click", (e) => {
      if (!isPointerDownOnDialog) {
        modal.close();
      }
    });
    const closeButton = modal.querySelector(".modal__close");
    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      modal.close();
    });

    this.#resetButton = modal.querySelector(".modal__action[type='reset']");

    this.#modalForm = modal.querySelector(".modal__form");
    this.#noteTitle = this.#modalForm.querySelector("#note-name");
    this.#selectController = new SelectController(
      this.#modalForm.querySelector(".select-wrapper"),
      [],
      {
        onChange: (option) => this.#addConnection(option),
        renderButton: (isOpen, button) => {
          if (isOpen) {
            button.innerHTML = "Choose note to connect";
          } else {
            button.innerHTML = `
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path
                  d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
                ></path>
              </svg>`;
          }
        },
      },
    );
    this.#connectionList = this.#modalForm.querySelector(".connections");
    this.#tagsList = this.#modalForm.querySelector(".tags__list");
    this.#tagsInput = this.#modalForm.querySelector(".tags__input");
    this.#addTagButton = this.#modalForm.querySelector(".tags__button");
    this.#description = this.#modalForm.querySelector("#note-description");

    this.#modalForm.addEventListener("submit", (e) => {
      this.onSumbit?.(this.#collectFormData());
      this.#resetForm();
    });

    modal.addEventListener("close", () => {
      this.#resetForm();
    });

    this.#resetButton.addEventListener("click", () => {
      this.#resetForm();
    });

    this.#addTagButton.addEventListener("click", () => this.#addTag());

    this.#tagsInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.#addTag();
      }
    });
  }

  setSelectOptions(options) {
    this.#allOptions = options;
    this.#selectController.setOptions(options);
  }

  #updateSelectOptions() {
    const optionsToShow = this.#allOptions.filter(
      (option) => !this.#connections.has(option.value),
    );

    this.setSelectOptions(optionsToShow);
  }

  #collectFormData() {
    const connections = Array.from(
      this.#connectionList.querySelectorAll(".connection"),
    ).map((li) => {
      const value = li.dataset.value;
      const to = li.querySelector(
        ".direction__input:has(+ .direction__box--to)",
      ).checked;
      const from = li.querySelector(
        ".direction__input:has(+ .direction__box--from)",
      ).checked;
      return { value, to, from };
    });

    return {
      title: this.#noteTitle.value.trim(),
      connections: connections,
      tags: this.#tags,
      description: this.#description.value.trim(),
    };
  }

  #resetForm() {
    this.#noteTitle.value = "";
    this.#description.value = "";
    this.#tagsList.innerHTML = "";
    this.#connectionList.innerHTML = "";
    this.#tags.clear();
    this.#connections.clear();
  }

  #addTag() {
    const tag = this.#tagsInput.value;
    this.#tagsInput.value = "";

    if (!tag || this.#tags.has(tag)) return;

    const tagElement = document.createElement("li");
    tagElement.className = "tag";
    tagElement.textContent = tag;

    this.#tagsList.appendChild(tagElement);
    this.#tags.add(tag);
  }

  #addConnection(connection) {
    const li = document.createElement("li");
    li.className = "connection";
    li.dataset.value = connection.value;

    const info = document.createElement("span");
    info.className = "connection__info";
    info.textContent = connection.text;

    const toLabel = this.#createDirectionCheckbox("to");
    const fromLabel = this.#createDirectionCheckbox("from");

    li.append(info, toLabel, fromLabel);

    this.#connectionList.appendChild(li);
    this.#connections.add(connection.value);
    this.#updateSelectOptions();
  }

  #createDirectionCheckbox(type) {
    const label = document.createElement("label");
    label.className = "checkbox";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "checkbox__input";

    const box = document.createElement("span");
    box.className = `checkbox__box checkbox__box--${type}`;

    const typeStr = String(type);
    box.title = `${typeStr[0].toUpperCase()}${typeStr.slice(1)} this note`;

    box.innerHTML = `
      <svg viewBox="0 0 256 256">
        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
      </svg>
    `;

    label.append(input, box);
    return label;
  }
}
