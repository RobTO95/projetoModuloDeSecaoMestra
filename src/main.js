import * as d3 from "d3";
import { getDrawScreenDimensions, getMousePosition } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";
import MoveShapeCommand from "./controllers/commands/MoveShapeCommand.js";
import ShapeMover from "./controllers/ShapeMover.js";
import CustomShape from "./models/CustomShape.js";

// Elementos DOM
const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");
const saveButton = document.getElementById("save-button");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const moveButton = document.getElementById("move-button");
const addCustomShapeButton = document.getElementById("addCustomShape-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");

// Grid
let gridSize = 1;

// Desloca o ponto zero para o centro de drawScreen
d3.select(shapesScreen).attr(
	"transform",
	`translate(${getDrawScreenDimensions(drawScreen).width / 2}, ${
		getDrawScreenDimensions(drawScreen).height / 2
	}) scale(1,-1)`
);

// Instancia de controllers --------------------------------------------------------------------------------------
const shapeController = new ShapeController(drawScreen, shapesScreen);
shapeController.loadShapes();
// Salvar projeto ------------------------------------------------------------------------------------------------
saveButton.addEventListener("click", (event) => {
	shapeController.saveShapes();
});

// Função para atualizar o estado dos botões de Undo e Redo ------------------------------------------------------
function updateUndoRedoButtons() {
	// Desativa o botão de Undo se a pilha estiver vazia
	if (shapeController.commandManager.undoStack.length === 0) {
		undoButton.classList.add("disabled");
		undoButton.disabled = true;
	} else {
		undoButton.classList.remove("disabled");
		undoButton.disabled = false;
	}

	// Desativa o botão de Redo se a pilha estiver vazia
	if (shapeController.commandManager.redoStack.length === 0) {
		redoButton.classList.add("disabled");
		redoButton.disabled = true;
	} else {
		redoButton.classList.remove("disabled");
		redoButton.disabled = false;
	}
}

// Eventos -------------------------------------------------------------------------------------------------------
undoButton.addEventListener("click", () => {
	shapeController.undo();
	updateUndoRedoButtons();
	// console.log("Shapes: ", shapeController.listShapes);
	// console.log(shapeController.commandManager.redoStack);
	// console.log(shapeController.commandManager.undoStack);
});

redoButton.addEventListener("click", () => {
	shapeController.redo();
	updateUndoRedoButtons();
	// console.log("Shapes: ", shapeController.listShapes);
	// console.log(shapeController.commandManager.redoStack);
	// console.log(shapeController.commandManager.undoStack);
});

addButton.addEventListener("click", () => {
	shapeController.addShape();
	updateUndoRedoButtons(); // Atualiza os botões após adicionar um shape
});

drawScreen.addEventListener("click", (event) => {
	shapeController.selectShape(event);
});

removeButton.addEventListener("click", (event) => {
	shapeController.removeShape();
	updateUndoRedoButtons(); // Atualiza os botões após remover um shape
});

// // Inicializa o manipulador de movimentação de shapes ---------------------------------------------------------
const moveShape = new ShapeMover(
	drawScreen,
	shapeController,
	gridSize,
	updateUndoRedoButtons
);

// Inicializa o estado dos botões --------------------------------------------------------------------------------
updateUndoRedoButtons();

// Redimensionamento da janela -----------------------------------------------------------------------------------
window.addEventListener("resize", (event) => {
	d3.select(shapesScreen).attr(
		"transform",
		`translate(${getDrawScreenDimensions(drawScreen).width / 2}, ${
			getDrawScreenDimensions(drawScreen).height / 2
		}) scale(1,-1)`
	);
});

// Criação de shapes ---------------------------------------------------------------------------------------------
// const customShape = new CustomShape(shapesScreen);
// customShape.arc(0, 0, 25, 45, 10);
const width1 = 100;
const thickness1 = 10;
const width2 = 100;
const thickness2 = 10;
const radius = 10;

// customShape.anchor(0, 0);
// customShape.line(200, 0);
// customShape.line(200, 10);
// customShape.arcTo(10, 10, 10, 15, 10);
// customShape.arc(15, 15, 5, 270, 180, true);
// customShape.line(10, 10);
// customShape.line(10, 200);
// customShape.line(0, 200);
// customShape.line(0, 0);

// customShape.close();

// customShape.angle = 45;
// customShape.position = [0, 100];
// customShape.scale = [-1, 1];

// console.log("Área = ", customShape.calculateArea());
// console.log("Centroide = ", customShape.calculateCentroid());

// customShape.angle = 45;
// customShape.position = [100, 100];
// customShape.scale = [2, 2];
// // customShape.line(10, 90);

// customShape.line(90, 90);
// customShape.line(90, 100);
// customShape.line(0, 100);

// customShape.close();

// function generatePath(drawScreen, line, gridSize, event) {
// 	const point = getMousePosition(drawScreen, gridSize, event);
// 	const listData = line.data || [];
// 	listData.push([point[0], -point[1]]);
// 	line.data = listData;
// }

// addCustomShapeButton.addEventListener("click", (event) => {
// 	drawScreen.style.cursor = "move";
// 	const line = new CustomShape([], shapesScreen);
// 	drawScreen.addEventListener("click", (event) => {
// 		generatePath(drawScreen, line, gridSize, event);
// 	});
// });
