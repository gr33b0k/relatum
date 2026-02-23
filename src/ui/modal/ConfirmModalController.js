export class ConfirmModalController {
  #resolve = null;

  constructor(modal) {
    this.modal = modal;
    this.modalTitle = this.modal.querySelector(".modal__title");
    this.modalMessage = this.modal.querySelector(".modal__message");
    this.confirmButton = this.modal.querySelector(".modal__action--submit");
    this.cancelButton = this.modal.querySelector(".modal__close");
    let isPointerDownOnDialog = false;

    this.modal.addEventListener("pointerdown", (e) => {
      isPointerDownOnDialog = e.target !== this.modal;
    });

    this.modal.addEventListener("click", (e) => {
      if (!isPointerDownOnDialog) {
        this.modal.close();
      }
    });

    this.confirmButton.addEventListener("click", () => this.#handleClose(true));
    this.cancelButton.addEventListener("click", () => this.#handleClose(false));
  }

  open(title, message) {
    this.modalTitle.textContent = title;
    this.modalMessage.textContent = message;
    this.modal.showModal();
  }

  confirm(title, message) {
    return new Promise((resolve) => {
      this.open(title, message);
      this.#resolve = resolve;
    });
  }

  #handleClose(result) {
    this.modal.close();
    if (this.#resolve) {
      this.#resolve(result);
      this.#resolve = null;
    }
  }
}
