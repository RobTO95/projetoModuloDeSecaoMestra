import * as d3 from "d3";
import { Shape } from "../models/shape.js";

import { getDrawScreenDimensions } from "../utils/utils.js";

import { getMousePosition } from "../utils/utils.js";

// Elementos DOM
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");

d3.select(shapesScreen).attr("transform", `translate(400,300)`);

// Salvo na memória

let listShapes = [];
let gridSize = 50;

// Shapes selecionados
let selectedShapes = [];

// Funções

function selectShape(event) {
	const shapeElement = event.target;

	// Se o clique foi em um path (shape), tenta selecionar ou deselecionar
	if (shapeElement.tagName === "path") {
		const idShape = shapeElement.id.replace("shape-", "");

		// Encontra o shape no array listShapes
		const clickedShape = listShapes.find((shape) => shape.id == idShape);

		// Verifica se Ctrl ou Cmd está pressionado para múltipla seleção
		const isMultiSelect = event.ctrlKey || event.metaKey;

		// Se o shape já está selecionado
		if (selectedShapes.includes(clickedShape)) {
			// Se múltipla seleção, apenas deseleciona o shape
			if (isMultiSelect) {
				selectedShapes = selectedShapes.filter(
					(shape) => shape !== clickedShape
				);
				clickedShape.strokeColor = "black"; // Muda o contorno de volta ao normal
			}
		} else {
			// Se não estiver selecionado, adiciona à lista de selecionados
			if (isMultiSelect) {
				selectedShapes.push(clickedShape);
			} else {
				// Deseleciona todos os outros se não for múltipla seleção
				deselectAllShapes();
				selectedShapes = [clickedShape];
			}
			clickedShape.strokeColor = "yellow"; // Muda o contorno para indicar seleção
		}
	} else {
		// Se clicou fora de um shape, deseleciona todos
		deselectAllShapes();
	}
}

function deselectAllShapes() {
	selectedShapes.forEach((shape) => {
		shape.strokeColor = "black"; // Redefine cor para não selecionado
	});
	selectedShapes = [];
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
		newShape.position = getMousePosition(drawScreen, gridSize, event);
	}

	// Adiciona o evento 'mousemove'
	drawScreen.addEventListener("mousemove", moveShape);

	// Adiciona o evento 'click' que remove o 'mousemove' e fixa o shape
	drawScreen.addEventListener("click", function handleClick(event) {
		newShape.position = getMousePosition(drawScreen, gridSize, event); // Fixa o shape na posição do clique
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

function isThereShapeSelected() {
	let selected = false;
	if (selectedShapes.length !== 0) {
		selected = true;
	}
	return selected;
}
let deleteMode = false; // Modo de exclusão ativado quando não há shapes selecionados

function deletePath(shapeObject) {
	const path = shapeObject.path.node();
	path.remove();
}

function removeShape(event) {
	if (isThereShapeSelected()) {
		// Remover o shape da visualização
		selectedShapes.forEach((shape) => {
			deletePath(shape);
		});
		// Remover objetos shape da lista listShapes
		listShapes = listShapes.filter((shape) => !selectedShapes.includes(shape));

		// Limpar memória dos shapes selecionados
		deselectAllShapes();
	} else {
		// Ativar o modo de exclusão para o próximo clique
		deleteMode = true;
		drawScreen.addEventListener("click", handleDeleteClick);
	}
}

function handleDeleteClick(event) {
	// Verificar se o clique foi em um shape
	const shape = event.target;
	if (shape.tagName === "path") {
		const shapeId = shape.id.replace("shape-", "");
		const shapeObject = listShapes.find((s) => s.id == shapeId);

		// Remover o shape clicado
		if (shapeObject) {
			deletePath(shapeObject);
			listShapes = listShapes.filter((s) => s.id != shapeId);
		}
	}

	// Desativar o modo de exclusão e remover o evento de clique
	deleteMode = false;
	drawScreen.removeEventListener("click", handleDeleteClick);
}

// Aplicação de eventos
addButton.addEventListener("click", addShape);

drawScreen.addEventListener("click", selectShape);

removeButton.addEventListener("click", removeShape);
