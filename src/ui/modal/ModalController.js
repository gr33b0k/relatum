export class ModalController {
  constructor() {
    this.modals = new Map();

    document.querySelectorAll(".modal").forEach((modal) => {
      this.modals.set(modal.dataset.modal, modal);
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
    });
  }

  open(modalName) {
    const modal = this.modals.get(modalName);
    modal.showModal();
  }
}
