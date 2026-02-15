export class ModalController {
  constructor() {
    this.modals = new Map();

    document.querySelectorAll(".modal").forEach((modal) => {
      this.modals.set(modal.dataset.modal, modal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.close();
        }
      });
    });
  }

  open(modalName) {
    const modal = this.modals.get(modalName);
    modal.showModal();
  }
}
