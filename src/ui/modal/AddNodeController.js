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
        ".checkbox__input:has(+ .checkbox__box--to)",
      ).checked;
      const from = li.querySelector(
        ".checkbox__input:has(+ .checkbox__box--from)",
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

    const tagText = document.createElement("span");
    tagText.textContent = tag;
    tagElement.appendChild(tagText);

    const removeButton = document.createElement("button");
    removeButton.className = "tag__remove";
    tagElement.appendChild(removeButton);

    removeButton.addEventListener("click", (e) => {
      e.preventDefault();
      tagElement.remove();
      this.#tags.delete(tag);
    });

    this.#tagsList.appendChild(tagElement);
    this.#tags.add(tag);
  }

  #addConnection(connection) {
    const li = document.createElement("li");
    li.className = "connection";
    li.dataset.value = connection.value;

    const connectionContent = document.createElement("div");
    connectionContent.classList.add("connection__content");

    const info = document.createElement("span");
    info.className = "connection__info";
    info.textContent = connection.text;

    const toLabel = this.#createDirectionCheckbox("to");
    const fromLabel = this.#createDirectionCheckbox("from");

    connectionContent.append(info, toLabel, fromLabel);

    const disconnectButton = document.createElement("button");
    disconnectButton.classList.add("connection__disconnect-button");

    disconnectButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
          <path 
            d="M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z">
          </path>
        </svg>
      `;

    disconnectButton.addEventListener("click", (e) => {
      e.preventDefault();
      li.remove();
      this.#connections.delete(connection.value);
    });

    li.append(connectionContent, disconnectButton);

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
