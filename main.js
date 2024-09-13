import * as d3 from "d3";
import { Shape } from "./src/shape.js";

// Elementos DOM
const addButton = document.getElementById("add-button");
const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");

d3.select(shapesScreen).attr("transform", `translate(400,300)`);

// Salvo na memória

const listShapes = [];
let gridSize = 1;

// Shapes selecionados
const currentShapes = [];

// Funções
function getDrawScreenDimensions(svgElement) {
	const bbox = svgElement.getBoundingClientRect();
	const width = bbox.width;
	const height = bbox.height;
	return { width, height };
}

function getMousePosition(svgElement, event) {
	const position = d3
		.pointer(event, svgElement)
		.map((value) => Number((value / gridSize).toFixed(0)) * gridSize);
	// console.log(position);
	position[0] = position[0] - getDrawScreenDimensions(svgElement).width / 2;
	position[1] = getDrawScreenDimensions(svgElement).height / 2 - position[1];
	return [position[0], position[1]];
}

function selectShape(event) {
	const shape = event.target;
	if (shape.tagName === "path") {
	}
}

function addShape() {
	// Dados para o shape (perfil L)
	const listPath = [
		[0, 0],
		[10, 0],
		[10, 90],
		[90, 90],
		[90, 100],
		[0, 100],
		[0, 0],
	];

	const newShape = new Shape(shapesScreen);

	// Função para mover o shape
	function moveShape(event) {
		newShape.data = listPath;
		newShape.position = getMousePosition(drawScreen, event);
	}

	// Adiciona o evento 'mousemove'
	drawScreen.addEventListener("mousemove", moveShape);

	// Adiciona o evento 'click' que remove o 'mousemove' e fixa o shape
	drawScreen.addEventListener("click", function handleClick(event) {
		newShape.position = getMousePosition(drawScreen, event); // Fixa o shape na posição do clique
		drawScreen.removeEventListener("mousemove", moveShape); // Remove o evento de movimentação
		drawScreen.removeEventListener("click", handleClick); // Remove o evento de clique para não repetir
	});
	if (listShapes.length === 0) {
		newShape.id = 1;
	} else {
		const lastShape = listShapes[listShapes.length - 1];
		newShape.id = lastShape.id + 1;
	}
	newShape.path.attr("id", `shape-${newShape.id}`);
	listShapes.push(newShape);
}

// Aplicação de eventos
addButton.addEventListener("click", addShape);

drawScreen.addEventListener("click", selectShape);
