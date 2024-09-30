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
});

redoButton.addEventListener("click", () => {
	shapeController.redo();
	updateUndoRedoButtons();
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

// Inicializa com o primeiro shape para fins de teste
const position = [100, 100];
const data = null;
shapeController.addShape(data, position);

// Inicializa o estado dos botões
updateUndoRedoButtons();

console.log(shapeController.commandManager.redoStack);
console.log(shapeController.commandManager.undoStack);
