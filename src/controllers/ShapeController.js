import CommandManager from "./commands/CommandManager.js";
import AddShapeCommand from "./commands/AddShapeCommand.js";
import RemoveShapeCommand from "./commands/RemoveShapeCommand.js";
import MoveShapeCommand from "./commands/MoveShapeCommand.js";
import AddShapeManager from "./managers/AddShapeManager.js";
import RemoveShapeManager from "./managers/RemoveShapeManager.js";
import SelectionManager from "./managers/SelectionManager.js";
import MoveShapeManager from "./managers/MoveShapeManager.js";
import { Shape } from "../models/shape.js";
import CustomShape from "../models/CustomShape.js";
export class ShapeController {
	constructor(drawScreen, shapesScreen) {
		this.drawScreen = drawScreen;
		this.shapesScreen = shapesScreen;

		this.commandManager = new CommandManager();
		this.addShapeManager = new AddShapeManager();
		this.removeShapeManager = new RemoveShapeManager();
		this.selectionManager = new SelectionManager();
		this.moveShapeManager = new MoveShapeManager();
		this.listShapes = [];
	}
	loadShapes() {
		const listShapesOnLC = JSON.parse(localStorage.getItem("shapes"));
		if (listShapesOnLC) {
			this.listShapes = listShapesOnLC.map((shapeData) => {
				const shape = new CustomShape(this.shapesScreen);
				shape.data = shapeData.data;
				shape.position = shapeData.position;
				shape.angle = shapeData.angle;
				shape.scale = shapeData.scale;
				shape.fill = shapeData.fill;
				shape.strokeColor = shapeData.strokeColor;
				shape.strokeWidth = shapeData.strokeWidth;
				shape.id = shapeData.id;
				return shape;
			});
			this.listShapes.forEach((shape) => {
				shape.regeneratePath();
			});
		}
	}

	saveShapes() {
		const listObjectsShape = this.listShapes.map((shape) => ({
			data: shape.data,
			position: shape.position,
			angle: shape.angle,
			scale: shape.scale,
			fill: shape.fill,
			strokeColor: shape.strokeColor,
			strokeWidth: shape.strokeWidth,
			id: shape.id,
		}));
		localStorage.setItem("shapes", JSON.stringify(listObjectsShape));
	}

	selectShape(event) {
		const shapeElement = event.target;
		this.selectionManager.selectShape(shapeElement, this.listShapes, event);
	}

	getSelectShape() {
		return this.selectionManager.selectedShapes;
	}
	addShape(shapeData, position) {
		const command = new AddShapeCommand(
			this.addShapeManager,
			this.listShapes,
			this.shapesScreen,
			shapeData,
			position
		);
		this.commandManager.executeCommand(command);
	}

	removeShape() {
		const selectedShape = this.selectionManager.getSelectedShape();
		if (selectedShape && selectedShape.length > 0) {
			const command = new RemoveShapeCommand(
				this.removeShapeManager,
				selectedShape,
				this.listShapes
			);
			this.commandManager.executeCommand(command);
		}
	}
	moveShape(firstPosition, lastPosition) {
		const selectedShape = this.selectionManager.getSelectedShape();
		if (selectedShape && selectedShape.length > 0) {
			const command = new MoveShapeCommand(
				this.moveShapeManager,
				selectedShape,
				firstPosition,
				lastPosition
			);
			this.commandManager.executeCommand(command);
		}
	}
	undo() {
		this.commandManager.undo();
	}

	redo() {
		this.commandManager.redo();
	}
}
