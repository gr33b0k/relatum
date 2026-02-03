export class SidebarConnectionsController {
  #root = null;

  constructor(root) {
    this.#root = root;
  }

  setConnections(connections) {
    this.#root.innerHTML = "";
    connections.forEach((c) => {
      const connElement = document.createElement("li");
      connElement.classList.add("sidebar__connection");
      const connInfoElement = document.createElement("div");
      connInfoElement.classList.add("sidebar__connection-info");
      const connDirectionElement = document.createElement("span");
      connDirectionElement.classList.add("connection__dirrection");
      const connNameElement = document.createElement("span");
      connNameElement.classList.add("connection__name");
      const connButtonElement = document.createElement("button");
      connButtonElement.classList.add("connection__button");

      const { name, type } = c;
      connNameElement.textContent = name;
      if (type === "source") {
        connDirectionElement.textContent = "→";
      } else {
        connDirectionElement.textContent = "←";
      }

      connInfoElement.append(connDirectionElement, connNameElement);
      connElement.append(connInfoElement, connButtonElement);
      this.#root.appendChild(connElement);
    });
  }
}
