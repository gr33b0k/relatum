export class SidebarConnectionsController {
  #root = null;

  onConnectionClick = null;

  constructor(root) {
    this.#root = root;
  }

  setConnections(connections) {
    this.#root.innerHTML = "";
    connections.forEach(({ id, name, type }) => {
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

      connNameElement.textContent = name;
      if (type === "source") {
        connDirectionElement.textContent = "→";
      } else {
        connDirectionElement.textContent = "←";
      }

      connInfoElement.append(connDirectionElement, connNameElement);
      connElement.append(connInfoElement, connButtonElement);

      connElement.addEventListener("click", (e) => {
        this.onConnectionClick?.(id);
      });

      this.#root.appendChild(connElement);
    });
  }
}
