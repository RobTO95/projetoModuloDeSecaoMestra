import { ShapeController } from "../controllers/ShapeController.js";

// Elementos DOM
const drawScreen = document.getElementById("draw-screen");
const shapesScreen = document.getElementById("shapes-screen");
const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

// Instancia de controllers

const shapeController = new ShapeController(
	drawScreen,
	shapesScreen,
	addButton,
	removeButton
);
