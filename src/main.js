import * as d3 from "d3";
import { getDrawScreenDimensions } from "./utils/utils.js";
import { ShapeController } from "./controllers/ShapeController.js";
import ShapeMover from "./controllers/ShapeMover.js";
import {
	LShapeBeam,
	Plate,
	RadiusPlate,
	TShapeBeam,
} from "./models/ShapesDefault.js";
import {
	LShapeStrategy,
	PlateStrategy,
	RadiusPlateStrategy,
	TShapeStrategy,
} from "./models/ShapeStrategy.js";
import { initializeCommandBar } from "./views/command-bar.js";
import CursorStyle from "./models/CursorStyle.js";

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

const messageBar = document.getElementById("command-messages");
const enterButton = document.getElementById("command-input-enter");

// Desloca o ponto zero para o centro de drawScreen
d3.select(shapesScreen).attr(
	"transform",
	`translate(${getDrawScreenDimensions(drawScreen).width / 2}, ${
		getDrawScreenDimensions(drawScreen).height / 2
	}) scale(1,-1)`
);

// Instancia de controllers --------------------------------------------------------------------------------------
const shapeController = new ShapeController(
	shapesScreen,
	messageBar,
	enterButton
);
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

/**
 * Command Bar
 */
initializeCommandBar(shapeController);

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

	switch (shapeType) {
		case "Plate":
			currentStrategyCreateShape = new PlateStrategy();
			shapeForm.innerHTML = `
				<label>Length: <input type="number" id="length" value="100"></label>
				<label>Thickness: <input type="number" id="thickness" value="6.35"></label>
			`;
			break;
		case "RadiusPlate":
			currentStrategyCreateShape = new RadiusPlateStrategy();
			shapeForm.innerHTML = `
				<label>Radius: <input type="number" id="radius" value="100"></label>
				<label>Thickness: <input type="number" id="thickness" value="6.35"></label>
				<label>Start angle: <input type="number" id="startAngle" value="180"></label>
				<label>End angle: <input type="number" id="endAngle" value="270"></label>
				<label>Clockwise Orientation: <input type="checkbox" id="orientation"></label>
			`;
			break;
		case "LShapeBeam":
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
			break;
		case "TShapeBeam":
			currentStrategyCreateShape = new TShapeStrategy();
			shapeForm.innerHTML = `
				<label>Soul Length: <input type="number" id="soulLength" value="100"></label>
				<label>Soul Thickness: <input type="number" id="soulThickness" value="6.35"></label>
				<label>Flange Length: <input type="number" id="flangeLength" value="100"></label>
				<label>Flange Thickness: <input type="number" id="flangeThickness" value="6.35"></label>
			`;
			break;
		// Adicione outros cases aqui para novos tipos de shapes
		default:
			console.error("Shape type não reconhecido:", shapeType);
			break;
	}

	// Atualiza o shape ao alterar qualquer valor do input
	shapeForm.querySelectorAll("input").forEach((input) => {
		input.addEventListener("input", () => updateShape());
	});
}

// Função para criar uma chapa
function createPlate(dimensions) {
	const { length, thickness } = dimensions;
	const gElement = d3.select(addedShapeDrawScreen).append("g").node();
	const shape = new Plate(gElement, length, thickness);
	shape.position = [length / 2, thickness / 2];
	return shape;
}

function createRadiusPlate(dimensions) {
	const { radius, thickness, startAngle, endAngle, orientation } = dimensions;
	const gElement = d3.select(addedShapeDrawScreen).append("g").node();
	const shape = new RadiusPlate(
		gElement,
		radius,
		thickness,
		startAngle,
		endAngle,
		orientation
	);
	shape.position = [radius + thickness, radius + thickness];
	return shape;
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
	shape.position = [flangeLength / 2, 0];
	return shape;
}

// Função para centralizar o shape no SVG
function centerShape(drawScreen, shape, shapeGroup) {
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
		// Verifica se é um checkbox e usa "checked" ao invés de "parseFloat"
		if (input.type === "checkbox") {
			dimensions[input.id] = input.checked; // Captura true ou false
		} else {
			dimensions[input.id] = parseFloat(input.value);
		}
	});

	// Verifica o tipo de shape e atualiza o path correspondente
	switch (shapeType) {
		case "Plate":
			currentShape = createPlate(dimensions);
			break;
		case "RadiusPlate":
			currentShape = createRadiusPlate(dimensions);
			break;
		case "LShapeBeam":
			currentShape = createLShapedBeam(dimensions);
			break;
		case "TShapeBeam":
			currentShape = createTShapeBeam(dimensions);
			break;
		// Adicione outros cases aqui para novos tipos de shapes
		default:
			console.error("Shape type não reconhecido:", shapeType);
			break;
	}
	centerShape(
		addedShapeDrawScreen,
		currentShape,
		addedShapeDrawScreen.querySelector("g")
	);
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

/** End add shape */
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
	if (addShapeArea.style.display === "flex") {
		updateShape();
	}
});
let zoomLevel = 1;
const zoomStep = 0.1;

function applyZoom(objectSVG, mouseX, mouseY) {
	const drawScreenDims = getDrawScreenDimensions(drawScreen);

	// Converte a posição do mouse para coordenadas relativas ao centro do SVG
	const offsetX = (mouseX - drawScreenDims.width / 2) / zoomLevel;
	const offsetY = (mouseY - drawScreenDims.height / 2) / zoomLevel;

	// Atualiza o transform do SVG, centralizando o zoom no ponto do mouse
	d3.select(objectSVG).attr(
		"transform",
		`translate(${drawScreenDims.width / 2 - offsetX * (zoomLevel - 1)}, 
                   ${drawScreenDims.height / 2 - offsetY * (zoomLevel - 1)}) 
                   scale(${zoomLevel}, -${zoomLevel})`
	);
	// moveShape.gridSize = gridSize / zoomLevel;
	// console.log(gridSize / zoomLevel);
}

// Evento de scroll para ajustar o nível de zoom
drawScreen.addEventListener("wheel", (event) => {
	event.preventDefault();

	// Obtém a posição do mouse relativa ao drawScreen
	const mouseX = event.clientX - drawScreen.getBoundingClientRect().left;
	const mouseY = event.clientY - drawScreen.getBoundingClientRect().top;

	// Ajusta o nível de zoom
	if (event.deltaY < 0) {
		zoomLevel += zoomStep;
	} else {
		zoomLevel = Math.max(zoomLevel - zoomStep, 0.1);
	}
	applyZoom(shapesScreen, mouseX, mouseY);
	shapeController.snap.snapRadius = 10 / zoomLevel;
});

// ------------------------------------------------------------------------------------------------------------------------------------

// Mover Shapes

// const shapeMoverSnap = new ShapeMoverSnap(
// 	shapeController,
// 	updateUndoRedoButtons
// );
const moveShapes = new ShapeMover(shapeController, () => {
	updateUndoRedoButtons();
	let snapElements = shapesScreen.querySelectorAll(".snap");
	snapElements.forEach((snapElement) => snapElement.remove());
});
moveButton.addEventListener("click", moveShapes.startMove);

// **********************************************************************************************************************************
// Snap feedback
const mouseTracker = shapeController.mouseTracker;
const mousePositionScreen = document.getElementById("position-mouse");
drawScreen.addEventListener("pointermove", (event) => {
	const positionSnap = shapeController.snap.snapTo(mouseTracker.mousePosition);
	if (positionSnap) {
		mouseTracker.mousePosition = { ...positionSnap.point };
		renderSnapPoints([positionSnap], shapesScreen);
	}
	mousePositionScreen.innerHTML = `<p>horizontal:${mouseTracker.mousePosition.x} <br> vertical:${mouseTracker.mousePosition.y}</p>`;
});

function renderSnapPoints(snapPoints, svgContainer) {
	if (snapPoints) {
		let snapElements = svgContainer.querySelectorAll(".snap");
		snapElements.forEach((snapElement) => snapElement.remove());
		snapPoints.forEach((snapPoint) => {
			if (snapPoint.type === "endPoint" || snapPoint.type === "controlPoint") {
				d3.select(svgContainer)
					.append("rect")
					.attr("x", snapPoint.point.x - 10 / zoomLevel / 2)
					.attr("y", snapPoint.point.y - 10 / zoomLevel / 2)
					.attr("width", 10 / zoomLevel)
					.attr("height", 10 / zoomLevel)
					.attr("fill", "none")
					.attr("stroke", "red")
					.attr("stroke-width", 1 / zoomLevel)
					.attr("class", "snap");
			}
			if (snapPoint.type === "centroid") {
				d3.select(svgContainer)
					.append("circle")
					.attr("cx", snapPoint.point.x)
					.attr("cy", snapPoint.point.y)
					.attr("r", 5 / zoomLevel)
					.attr("fill", "none")
					.attr("stroke", "red")
					.attr("stroke-width", 1 / zoomLevel)
					.attr("class", "snap");
			}
		});
	}
}

// **********************************************************************************************************************************
// Cursor style
const newCursor = new CursorStyle(shapesScreen, shapeController);

// **********************************************************************************************************************************

// const commandBar = new CommandBar(messageBar);

// commandBar.visibleOn();
// commandBar.writeMessage(
// 	"<p>Messagem indicanto algum comando <button>clique aqui!</button>:</p>"
// );
// document.getElementById("command-input-bar").focus();
// // commandBar.visibleOff();
// shapeController.snap.onSnap();

//-------------------------------------------------------------------------------------------------------------------------------------
// Snap options

const snapOptions = [
	...document.getElementById("snap-options").querySelectorAll("input"),
];

function setSnapTypes(snapTypes) {
	const key = "snapOptions";
	const value = JSON.stringify(snapTypes);
	localStorage.setItem(key, value);
}

function getSnapType(snapOptions) {
	let snapTypesObject = JSON.parse(localStorage.getItem("snapOptions"));
	if (snapTypesObject) {
		snapOptions.forEach((snap) => {
			if (Object.keys(snapTypesObject).includes(snap.id)) {
				snap.checked = snapTypesObject[snap.id];
			}
		});
		shapeController.snap.activeSnapTypes = snapTypesObject;
	}
}

getSnapType(snapOptions);

function handleSnapTypes(snapOptions) {
	const snapTypes = {};
	snapOptions.forEach((snap) => {
		snapTypes[snap.id] = snap.checked;
	});
	return snapTypes;
}

snapOptions.forEach((snap) => {
	snap.addEventListener("click", () => {
		const snapTypes = handleSnapTypes(snapOptions);
		setSnapTypes(snapTypes);
		shapeController.snap.activeSnapTypes = snapTypes;
	});
});
