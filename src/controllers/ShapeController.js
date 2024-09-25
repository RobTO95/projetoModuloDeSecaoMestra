import * as d3 from "d3";
import { getDrawScreenDimensions } from "../utils/utils.js";
import { AddShapeManager } from "./AddShapeManager.js";
import { RemoveShapeManager } from "./RemoveShapeManager.js";
import { SelectionManager } from "./SelectionManager.js";

export class ShapeController {
	constructor(drawScreen, shapesScreen, addButton, removeButton) {
		this.drawScreen = drawScreen;
		this.shapesScreen = shapesScreen;
		this.addButton = addButton;
		this.removeButton = removeButton;
		this.gridSize = 10;

		this.addShapeManager = new AddShapeManager(
			shapesScreen,
			drawScreen,
			this.gridSize
		);
		this.removeShapeManager = new RemoveShapeManager();
		this.selectionManager = new SelectionManager();

		d3.select(this.shapesScreen).attr(
			"transform",
			`translate(${getDrawScreenDimensions(this.drawScreen).width / 2}, ${
				getDrawScreenDimensions(this.drawScreen).height / 2
			}) scale(1,1)`
		);

		// Configurar eventos
		this.drawScreen.addEventListener("click", this.selectShape.bind(this));
		this.addButton.addEventListener("click", this.addShape.bind(this));
		this.removeButton.addEventListener("click", this.removeShape.bind(this));

		// Atualiza lista de shapes na RemoveShapeManager
		this.removeShapeManager.listShapes = this.addShapeManager.listShapes;
	}

	addShape() {
		this.addShapeManager.addShape();
		// Atualiza a lista de shapes na RemoveShapeManager após adicionar um novo shape
		this.removeShapeManager.listShapes = this.addShapeManager.listShapes;
	}

	selectShape(event) {
		const shapeElement = event.target;
		this.selectionManager.selectShape(
			shapeElement,
			this.addShapeManager.listShapes,
			event
		);
	}

	removeShape() {
		if (this.selectionManager.isThereShapeSelected()) {
			this.removeShapeManager.removeShape(this.selectionManager.selectedShapes);
			this.selectionManager.deselectAllShapes();
			// Atualiza a lista de shapes após remoção
			this.removeShapeManager.listShapes = this.addShapeManager.listShapes;
		}
	}
}
