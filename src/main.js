import * as d3 from "d3";
import { getDrawScreenDimensions, getMousePosition } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";
import MoveShapeCommand from "./controllers/commands/MoveShapeCommand.js";
import ShapeMover from "./controllers/ShapeMover.js";
import CustomShape from "./models/CustomShape.js";
import { LShapeBeam, TShapeBeam } from "./models/ShapesDefault.js";
import { LShapeStrategy, TShapeStrategy } from "./models/ShapeStrategy.js";

// Elementos DOM
// - Option bar
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
let gridSize = 5;

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

// ---------------------------------------------------------------------------------------------------------------

/** Add Shape */

// - Insert Shape area

const addedShapeDrawScreen = document.getElementById("added-shape");
const shapeForm = document.getElementById("shape-dimensions-form");
const shapeSelect = document.getElementById("type-shape-add-current");

let currentShape = null; // Para armazenar o shape atualmente desenhado
let currentStrategyCreateShape = null;

// Função para limpar o SVG de shapes anteriores
function clearDrawScreen(drawScreen) {
	drawScreen.querySelectorAll("g").forEach((g) => {
		drawScreen.removeChild(g);
	});
}

// Função para criar o formulário com os inputs correspondentes às dimensões
function createShapeInputs(shapeType) {
	shapeForm.innerHTML = ""; // Limpa os inputs existentes

	if (shapeType === "LShapeBeam") {
		currentStrategyCreateShape = new LShapeStrategy();
		shapeForm.innerHTML = `
			<label>Leg Length 1: <input type="number" id="legLength1" value="100"></label>
			<label>Leg Length 2: <input type="number" id="legLength2" value="100"></label>
			<label>Thickness 1: <input type="number" id="thickness1" value="6.35"></label>
			<label>Thickness 2: <input type="number" id="thickness2" value="6.35"></label>
			<label>Radius 1: <input type="number" id="radius1" value="5"></label>
			<label>Radius 2: <input type="number" id="radius2" value="5"></label>
			<label>Radius 3: <input type="number" id="radius3" value="5"></label>
			<label>Radius 4: <input type="number" id="radius4" value="5"></label>
		`;
	} else if (shapeType === "TShapeBeam") {
		currentStrategyCreateShape = new TShapeStrategy();
		shapeForm.innerHTML = `
			<label>Soul Length: <input type="number" id="soulLength" value="100"></label>
			<label>Soul Thickness: <input type="number" id="soulThickness" value="6.35"></label>
			<label>Flange Length: <input type="number" id="flangeLength" value="100"></label>
			<label>Flange Thickness: <input type="number" id="flangeThickness" value="6.35"></label>
		`;
	}

	// Atualiza o shape ao alterar qualquer valor do input
	shapeForm.querySelectorAll("input").forEach((input) => {
		input.addEventListener("input", () => updateShape());
	});
}

// Função para criar um shape L
function createLShapedBeam(dimensions) {
	const {
		legLength1,
		legLength2,
		thickness1,
		thickness2,
		radius1,
		radius2,
		radius3,
		radius4,
	} = dimensions;
	const gElement = d3.select(addedShapeDrawScreen).append("g").node();
	const shape = new LShapeBeam(
		gElement,
		legLength1,
		legLength2,
		thickness1,
		thickness2,
		radius1,
		radius2,
		radius3,
		radius4
	);
	return shape;
}

// Função para criar um shape T
function createTShapeBeam(dimensions) {
	const { soulLength, soulThickness, flangeLength, flangeThickness } =
		dimensions;

	const gElement = d3.select(addedShapeDrawScreen).append("g").node();
	const shape = new TShapeBeam(
		gElement,
		soulLength,
		soulThickness,
		flangeLength,
		flangeThickness
	);
	return shape;
}

// Função para centralizar o shape no SVG
function centerShape(drawScreen, shapeGroup) {
	const drawScreenDims = getDrawScreenDimensions(drawScreen);
	const shapeDims = getDrawScreenDimensions(shapeGroup);
	// Calcula a escala com base nas dimensões máximas
	const scale =
		Math.min(
			drawScreenDims.width / shapeDims.width,
			drawScreenDims.height / shapeDims.height
		) * 0.95;

	// Centraliza o shape considerando o "bounding box" e sua origem
	const xOffset = (drawScreenDims.width - shapeDims.width * scale) / 2;
	const yOffset = (drawScreenDims.height + shapeDims.height * scale) / 2;

	// Aplica a centralização e escala ajustada
	d3.select(shapeGroup).attr(
		"transform",
		`translate(${xOffset}, ${yOffset}) scale(${scale}, -${scale})`
	);
}

// Função para atualizar o shape baseado nos inputs
function updateShape() {
	clearDrawScreen(addedShapeDrawScreen);

	// Obtém o tipo de shape selecionado no select
	const shapeType = document.getElementById("type-shape-add-current").value;

	// Coleta os valores dos inputs de dimensões
	let dimensions = {};
	shapeForm.querySelectorAll("input").forEach((input) => {
		dimensions[input.id] = parseFloat(input.value);
	});

	// Verifica o tipo de shape e atualiza o path correspondente
	if (shapeType === "LShapeBeam") {
		currentShape = createLShapedBeam(dimensions);
	} else if (shapeType === "TShapeBeam") {
		currentShape = createTShapeBeam(dimensions);
	}
	centerShape(addedShapeDrawScreen, addedShapeDrawScreen.querySelector("g"));
}

// Detecta quando o usuário muda o tipo de shape no select
document
	.getElementById("type-shape-add-current")
	.addEventListener("change", (event) => {
		createShapeInputs(event.target.value); // Atualiza os inputs de acordo com o tipo de shape
		updateShape(); // Atualiza o shape com as dimensões padrão
	});

// Inicializa a página com o shape e inputs correspondentes ao primeiro tipo selecionado
createShapeInputs(document.getElementById("type-shape-add-current").value);

const confirmAddShapeButton = document.getElementById(
	"confirm-add-shape-button"
);
const cancelAddShapeButton = document.getElementById("cancel-add-shape-button");

const addShapeArea = document.getElementById("insert-shape-area");

addButton.addEventListener("click", () => {
	if (addShapeArea.style.display === "flex") {
		addShapeArea.style.display = "none";
	} else {
		addShapeArea.style.display = "flex";
		updateShape();
	}
});

confirmAddShapeButton.addEventListener("click", () => {
	shapeController.addShape(
		currentStrategyCreateShape,
		currentShape.getDimensions()
	);
	updateUndoRedoButtons(); // Atualiza os botões após adicionar um shape
});
cancelAddShapeButton.addEventListener("click", () => {
	addShapeArea.style.display = "none";
});
// ---------------------------------------------------------------------------------------------------------------
/** Seleção de shapes */
drawScreen.addEventListener("click", (event) => {
	shapeController.selectShape(event);
});

/** Remoção de shapes */
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
	updateShape();
});
