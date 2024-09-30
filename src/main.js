import * as d3 from "d3";
import { getDrawScreenDimensions } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";
// Elementos DOM
const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");

// Desloca o ponto zero para o centro de drawScreen
d3.select(shapesScreen).attr(
	"transform",
	`translate(${getDrawScreenDimensions(drawScreen).width / 2}, ${
		getDrawScreenDimensions(drawScreen).height / 2
	}) scale(1,1)`
);

// Instancia de controllers

const shapeController = new ShapeController(drawScreen, shapesScreen);

// Eventos
undoButton.addEventListener("click", () => {
	shapeController.undo();
	console.log("Desfazer pilha:", shapeController.commandManager.undoStack);
	console.log("Refazer pilha:", shapeController.commandManager.redoStack);
});

redoButton.addEventListener("click", () => {
	shapeController.redo();
	console.log("Desfazer pilha:", shapeController.commandManager.undoStack);
	console.log("Refazer pilha:", shapeController.commandManager.redoStack);
});

const position = [0, 100];
const data = null;
shapeController.addShape(data, position);

addButton.addEventListener("click", () => {
	shapeController.addShape();
});
