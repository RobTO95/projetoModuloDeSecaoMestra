import * as d3 from "d3";
import { Shape } from "../models/shape.js";

import { getDrawScreenDimensions } from "../utils/utils.js";

import { getMousePosition } from "../utils/utils.js";

export class ShapeController {
	#strokeColor = "";
	#strokeColorSeleted = "yellow";
	constructor(drawScreen, shapesScreen, addButton, removeButton) {
		this.drawScreen = drawScreen;
		this.shapesScreen = shapesScreen;
		this.addButton = addButton;
		this.removeButton = removeButton;
		this.gridSize = 10;
		this.listShapes = [];
		this.selectedShapes = [];
		this.deleteMode = false;

		d3.select(this.shapesScreen).attr(
			"transform",
			`translate(${getDrawScreenDimensions(this.drawScreen).width / 2}, ${
				getDrawScreenDimensions(this.drawScreen).height / 2
			}) scale(1,1)`
		);

		// configurar eventos

		this.drawScreen.addEventListener("click", this.selectShape.bind(this));
		this.addButton.addEventListener("click", this.addShape.bind(this));
		this.removeButton.addEventListener("click", this.removeShape.bind(this));
	}

	addShape() {
		console.log(this.listShapes);
		const listPath = [
			[0, 0],
			[10, 0],
			[10, 90],
			[90, 90],
			[90, 100],
			[0, 100],
			[0, 0],
		];

		const newShape = new Shape(this.shapesScreen);

		const moveShape = (event) => {
			newShape.data = listPath;
			newShape.position = getMousePosition(
				this.drawScreen,
				this.gridSize,
				event
			);
		};

		this.drawScreen.addEventListener("mousemove", moveShape);

		const handleClick = (event) => {
			newShape.position = getMousePosition(
				this.drawScreen,
				this.gridSize,
				event
			);
			this.drawScreen.removeEventListener("mousemove", moveShape);
			this.drawScreen.removeEventListener("click", handleClick);
		};
		this.drawScreen.addEventListener("click", handleClick);

		const lastShape = this.listShapes[this.listShapes.length - 1];
		newShape.id = lastShape ? lastShape.id + 1 : 1;
		newShape.path.attr("id", `shape-${newShape.id}`);
		this.listShapes.push(newShape);
	}
	selectShape(event) {
		const shapeElement = event.target;

		if (shapeElement.tagName === "path") {
			const idShape = shapeElement.id.replace("shape-", "");
			const clickedShape = this.listShapes.find((shape) => shape.id == idShape);

			const isMultiSelect = event.ctrlKey || event.metaKey;

			if (this.selectedShapes.includes(clickedShape)) {
				if (isMultiSelect) {
					this.selectedShapes = this.selectedShapes.filter(
						(shape) => shape !== clickedShape
					);
					clickedShape.strokeColor = this.#strokeColor;
				}
			} else {
				if (isMultiSelect) {
					this.selectedShapes.push(clickedShape);
				} else {
					this.deselectAllShapes();
					this.selectedShapes = [clickedShape];
				}
				clickedShape.strokeColor = this.#strokeColorSeleted;
			}
		} else {
			this.deselectAllShapes();
		}
	}
	deselectAllShapes() {
		this.selectedShapes.forEach((shape) => {
			shape.strokeColor = this.#strokeColor;
		});
		this.selectedShapes = [];
	}

	isThereShapeSelected() {
		return this.selectedShapes.length !== 0;
	}

	deletePath(shapeObject) {
		const path = shapeObject.path.node();
		path.remove();
	}

	removeShape() {
		if (this.isThereShapeSelected()) {
			this.selectedShapes.forEach((shape) => {
				this.deletePath(shape);
			});
			this.listShapes = this.listShapes.filter(
				(shape) => !this.selectedShapes.includes(shape)
			);
			this.deselectAllShapes();
		} else {
			this.deleteMode = true;
			this.drawScreen.addEventListener("click", (e) =>
				this.handleDeleteClick(e)
			);
		}
	}

	handleDeleteClick(event) {
		if (!this.deleteMode) {
			return;
		}
		const shape = event.target;
		if (shape.tagName === "path") {
			const shapeId = shape.id.replace("shape-", "");
			const shapeObject = this.listShapes.find((s) => s.id == shapeId);
			if (shapeObject) {
				this.deletePath(shapeObject);
				this.listShapes = this.listShapes.filter((s) => s.id != shapeId);
			}
		}
		this.deleteMode = false;
		this.drawScreen.removeEventListener("click", this.handleDeleteClick);
	}
}
