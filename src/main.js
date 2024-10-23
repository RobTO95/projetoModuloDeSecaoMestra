import * as d3 from "d3";
import { getDrawScreenDimensions, getMousePosition } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";
import MoveShapeCommand from "./controllers/commands/MoveShapeCommand.js";
import ShapeMover from "./controllers/ShapeMover.js";
import CustomShape from "./models/CustomShape.js";
import { LShapedBeam, TShapeBeam } from "./models/ShapesDefault.js";
import { LShapeStrategy } from "./models/ShapeStrategy.js";

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

let currentShape = null; // Para armazenar o shape atualmente desenhado

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
		shapeForm.innerHTML = `
			<label>Soul Length: <input type="number" id="soulLength" value="100"></label>
			<label>Soul Thickness: <input type="number" id="soulThickness" value="6.35"></label>
			<label>Flange Length: <input type="number" id="flangeLength" value="50"></label>
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
	const shape = new LShapedBeam(
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

	centerShape(addedShapeDrawScreen, gElement);
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

	centerShape(addedShapeDrawScreen, gElement);
	return shape;
}

// Função para centralizar o shape no SVG
function centerShape(drawScreen, shapeGroup) {
	const drawScreenDims = getDrawScreenDimensions(drawScreen);
	const shapeDims = getDrawScreenDimensions(shapeGroup);

	d3.select(shapeGroup).attr(
		"transform",
		`translate(${drawScreenDims.width / 2 - shapeDims.width / 2}, 
		${drawScreenDims.height / 2 + shapeDims.height / 2}) 
		scale(1.5, -1.5)`
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
updateShape();

// const addedShapeDrawScreen = document.getElementById("added-shape");

// const confirmAddShapeButton = document.getElementById(
// 	"confirm-add-shape-button"
// );
// const cancelAddShapeButton = document.getElementById("cancel-add-shape-button");

// const addShapeArea = document.getElementById("insert-shape-area");

// function insertShapeControl() {
// 	addedShapeDrawScreen.querySelectorAll("g").forEach((g) => {
// 		addedShapeDrawScreen.removeChild(g);
// 	});

// 	const gAddedShapeDrawScreen = d3
// 		.select(addedShapeDrawScreen)
// 		.append("g")
// 		.node();

// 	const shapeAdded = new LShapedBeam(
// 		gAddedShapeDrawScreen,
// 		100,
// 		100,
// 		6.35,
// 		6.35,
// 		0,
// 		0,
// 		0,
// 		0
// 	);

// 	d3.select(gAddedShapeDrawScreen).attr(
// 		"transform",
// 		`translate(${
// 			getDrawScreenDimensions(addedShapeDrawScreen).width / 2 -
// 			getDrawScreenDimensions(gAddedShapeDrawScreen).width / 2
// 		}, ${
// 			getDrawScreenDimensions(addedShapeDrawScreen).height / 2 +
// 			getDrawScreenDimensions(gAddedShapeDrawScreen).height / 2
// 		}) scale(1.5,-1.5)`
// 	);
// }

// addButton.addEventListener("click", () => {
// 	if (addShapeArea.style.display === "flex") {
// 		addShapeArea.style.display = "none";
// 	} else {
// 		addShapeArea.style.display = "flex";
// 		insertShapeControl();
// 	}
// });

// confirmAddShapeButton.addEventListener("click", () => {
// 	shapeController.addShape();
// 	updateUndoRedoButtons(); // Atualiza os botões após adicionar um shape
// });
// cancelAddShapeButton.addEventListener("click", () => {
// 	addShapeArea.style.display = "none";
// });
// ---------------------------------------------------------------------------------------------------------------

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
// const width1 = 100;
// const thickness1 = 10;
// const width2 = 100;
// const thickness2 = 10;
// const radius = 10;

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
