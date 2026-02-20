import { SelectController } from "../select/SelectController.js";

export class AddNodeController {
  #modalForm = null;
  #noteTitle = null;
  #connectionList = null;
  #selectController = null;
  #tagsList = null;
  #tagsInput = null;
  #addTagButton = null;
  #description = null;

  #tags = new Set();

  onSumbit = null;

  constructor(modal) {
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
      e.preventDefault();

      this.onSumbit?.({
        title: this.#noteTitle.value.trim(),
        tags: this.#tags,
        description: this.#description.value.trim(),
      });
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
    this.#selectController.setOptions(options);
  }

  #resetForm() {
    this.#noteTitle.value = "";
    this.#description.value = "";
    this.#tagsList.innerHTML = "";
    this.#connectionList.innerHTML = "";
    this.#tags.clear();
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
    const connectionElement = document.createElement("li");
    connectionElement.dataset.value = connection.value;
    connectionElement.className = "connection";
    connectionElement.textContent = connection.text;
    this.#connectionList.appendChild(connectionElement);
  }
}
