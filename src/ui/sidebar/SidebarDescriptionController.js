export class SidebarDescriptionController {
  #description = null;
  #oldText = null;
  #editButton = null;
  #isEditing = false;
  #textarea = null;

  onDescriptionChange = null;

  constructor(root) {
    this.#description = root.querySelector(".sidebar__description-text");
    this.#editButton = root.querySelector(".sidebar__edit-description");
    this.#editButton.addEventListener("click", () => this.#toggleEdit());
  }

  renderDescription(description) {
    this.#description.textContent = description
      ? description
      : "This note has no description";
  }

  #toggleEdit() {
    if (!this.#isEditing) {
      this.#startEditing();
    } else {
      this.#save();
    }
  }

  #startEditing() {
    this.#isEditing = true;

    const textarea = document.createElement("textarea");
    this.#oldText = this.#description.textContent;

    textarea.value = this.#oldText;
    textarea.className = "sidebar__description-text";

    this.#description.replaceWith(textarea);
    this.#textarea = textarea;

    this.#textarea.style.height = this.#textarea.scrollHeight + "px";
    this.#textarea.addEventListener("input", () => {
      this.#textarea.style.height = this.#textarea.scrollHeight + "px";
    });

    this.#textarea.focus();

    this.#textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.#save();
      }

      if (e.key === "Escape") {
        this.#cancel();
      }
    });

    this.#editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z">
            </path>
        </svg>
    `;
  }

  #save() {
    if (!this.#textarea) return;

    const newText = this.#textarea.value.trim();

    const pre = document.createElement("pre");
    pre.className = "sidebar__description-text";
    pre.textContent = newText || "This node have no description";

    this.#textarea.replaceWith(pre);
    this.#description = pre;

    this.#textarea = null;
    this.#isEditing = false;

    this.onDescriptionChange?.(newText);

    this.#editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z">
            </path>
        </svg>
    `;
  }

  #cancel() {
    if (!this.#textarea) return;

    const pre = document.createElement("pre");
    pre.className = "sidebar__description-text";
    pre.textContent = this.#oldText;

    this.#textarea.replaceWith(pre);
    this.#description = pre;

    this.#textarea = null;
    this.#isEditing = false;

    this.#editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z">
            </path>
        </svg>
    `;
  }
}
