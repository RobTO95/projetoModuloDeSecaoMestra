import * as d3 from "d3";

import { Shape } from "./src/shape.js";

const addButton = document.getElementById("add-button");
const drawScreen = document.getElementById("shapes-screen");

d3.select(drawScreen).attr("transform", `translate(400,300)`);

// d3.select(drawScreen).attr("transform", `translate(400,300)`);
const listShapes = [];

// Adicionar um novo shape
function addShape() {
	// Dados para o shape (retângulo)
	const listPath = [
		[0, 0],
		[10, 0],
		[10, 90],
		[90, 90],
		[90, 100],
		[0, 100],
	];

	const newShape = Shape(listPath);
}
addButton.addEventListener("click", (event) => {
	addShape();
});

// Função externa para criar uma cópia espelhada do shape
function mirror(shape, direction = "horizontal") {
	// Cria uma nova instância do shape, copiando os dados e a escala do shape original
	const mirroredShape = new Shape(
		shape.objectDraw.node(),
		shape.data,
		[...shape.position],
		shape.angle,
		[...shape.scale] // Copia a escala do shape original
	);

	// Aplica a transformação de espelhamento
	if (direction === "horizontal") {
		mirroredShape.scale = [-mirroredShape.scale[0], mirroredShape.scale[1]]; // Inverte o eixo X
	} else if (direction === "vertical") {
		mirroredShape.scale = [mirroredShape.scale[0], -mirroredShape.scale[1]]; // Inverte o eixo Y
	} else if (direction === "both") {
		mirroredShape.scale = [-mirroredShape.scale[0], -mirroredShape.scale[1]]; // Inverte ambos os eixos
	}

	// Redesenha a cópia espelhada
	mirroredShape.updatePath();

	return mirroredShape; // Retorna o novo shape espelhado
}
