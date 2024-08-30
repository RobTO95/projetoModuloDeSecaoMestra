import * as d3 from "d3";

import { Shape } from "./src/shape.js";

const addButton = document.getElementById("add-button");
const drawScreen = document.getElementById("draw-screen");

// d3.select(drawScreen).attr("transform", `translate(400,300)`);
const listShapes = [];

// Dados para o shape (retângulo)
const listPath = [
	[0, 0],
	[10, 0],
	[10, 90],
	[90, 90],
	[90, 100],
	[0, 100],
];

// Função para adicionar shapes
function addShape(position = [0, 0]) {
	const shape = new Shape(drawScreen, listPath, position);
	listShapes.push(shape);
	console.log("Shapes na tela:", listShapes);
}

// Listener do botão de adicionar shapes
addButton.addEventListener("click", addShape);

addShape();
