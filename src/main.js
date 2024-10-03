import * as d3 from "d3";
import { getDrawScreenDimensions, getMousePosition } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";

// Elementos DOM
const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const moveButton = document.getElementById("move-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");

// Grid
let gridSize = 10;

// Desloca o ponto zero para o centro de drawScreen
d3.select(shapesScreen).attr(
	"transform",
	`translate(${getDrawScreenDimensions(drawScreen).width / 2}, ${
		getDrawScreenDimensions(drawScreen).height / 2
	}) scale(1,1)`
);

// Instancia de controllers
const shapeController = new ShapeController(drawScreen, shapesScreen);

// Função para atualizar o estado dos botões de Undo e Redo
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

// Eventos
undoButton.addEventListener("click", () => {
	shapeController.undo();
	updateUndoRedoButtons();
	console.log(shapeController.commandManager.redoStack);
	console.log(shapeController.commandManager.undoStack);
});

redoButton.addEventListener("click", () => {
	shapeController.redo();
	updateUndoRedoButtons();
	console.log(shapeController.commandManager.redoStack);
	console.log(shapeController.commandManager.undoStack);
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

// Mover shapes ------------------------------------------------------------------------
moveButton.addEventListener("click", (event) => {
	let firstPosition = null;
	let lastPosition = null;

	function onMouseDown(event) {
		firstPosition = getMousePosition(drawScreen, gridSize, event);
		drawScreen.addEventListener("mouseup", onMouseUp);
		drawScreen.removeEventListener("mousedown", onMouseDown);
	}

	function onMouseUp(event) {
		lastPosition = getMousePosition(drawScreen, gridSize, event);

		// Verifica se ambas as posições foram capturadas antes de mover o shape
		if (firstPosition && lastPosition) {
			shapeController.moveShape(firstPosition, lastPosition);
			updateUndoRedoButtons();
			// Remove o evento de mouseup após o movimento
			drawScreen.removeEventListener("mouseup", onMouseUp);
			firstPosition = null;
			lastPosition = null;
		}
	}

	// Adiciona o evento de mousedown e mouseup
	// console.log(
	// 	"Modo de movimento ativado. Clique e arraste para mover o shape."
	// );
	drawScreen.addEventListener("mousedown", onMouseDown);
});

// Inicializa com o primeiro shape para fins de teste
const position = [100, 100];
const data = null;
shapeController.addShape(data, position);

// Inicializa o estado dos botões
updateUndoRedoButtons();
