import { AppController } from "./AppController.js";

const canvas = document.getElementById("graphCanvas");

const app = new AppController(canvas);

app.start();
