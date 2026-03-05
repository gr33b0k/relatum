import { SelectController } from "../select/SelectController.js";

export class SidebarConnectionsController {
  #root = null;
  #addConnectionButton = null;
  #connectionsList = null;

  #selectController = null;

  #allNotes = null;
  #currentNoteId = null;
  #connections = new Set();

  onConnectionClick = null;
  onAddConnection = null;

  constructor(root) {
    this.#root = root;
    this.#addConnectionButton = this.#root.querySelector(".select-wrapper");
    this.#connectionsList = this.#root.querySelector(".connections");

    this.#selectController = new SelectController(
      this.#addConnectionButton,
      [],
      {
        onChange: (connection) =>
          this.#addConnection(connection.value, connection.text),
      },
    );
  }

  setAllNotes(notes) {
    this.#allNotes = notes;
  }

  setCurrentNote(currentNoteId) {
    this.#currentNoteId = currentNoteId;
  }

  updateSelectOptions() {
    const options = this.#allNotes.filter(({ value }) => {
      return !this.#connections.has(value) && value !== this.#currentNoteId;
    });

    this.#selectController.setOptions(options);
  }

  setConnections(connections) {
    this.#connectionsList.innerHTML = "";
    this.#connections = new Set();
    connections.forEach(({ id, name, type }) => {
      this.#addConnection(id, name, type, false);
    });

    this.updateSelectOptions();
  }

  #addConnection(id, name, type = "source", isNewConnection = true) {
    const connElement = document.createElement("li");
    connElement.classList.add("connection");
    connElement.dataset.id = id;
    const connContentElement = document.createElement("div");
    connContentElement.classList.add("connection__content");
    const connInfoElement = document.createElement("div");
    connInfoElement.classList.add("connection__info");
    const connDirectionElement = document.createElement("span");
    connDirectionElement.classList.add("connection__direction");
    const connNameElement = document.createElement("span");
    connNameElement.classList.add("connection__name");
    const connArrowElement = document.createElement("span");
    connArrowElement.classList.add("connection__arrow");
    const disconnectButton = document.createElement("button");
    disconnectButton.classList.add("connection__disconnect-button");

    disconnectButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
          <path 
            d="M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z">
          </path>
        </svg>
      `;

    connNameElement.textContent = name;
    if (type === "source") {
      connDirectionElement.textContent = "→";
    } else {
      connDirectionElement.textContent = "←";
    }

    connInfoElement.append(connDirectionElement, connNameElement);
    connContentElement.append(connInfoElement, connArrowElement);
    connElement.append(connContentElement, disconnectButton);

    disconnectButton.addEventListener("click", (e) => {
      this.onDisconnect?.(id, type);
      this.#connections.delete(id);
      connElement.remove();
      this.updateSelectOptions();
    });

    connContentElement.addEventListener("click", (e) => {
      this.onConnectionClick?.(id);
    });

    this.#connectionsList.appendChild(connElement);
    this.#connections.add(id);

    if (isNewConnection) {
      this.updateSelectOptions();
      this.onAddConnection?.(id);
    }
  }
}
