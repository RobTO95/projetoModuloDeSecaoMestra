import * as d3 from "d3";
import CommandManager from "./commands/CommandManager.js";
import AddShapeCommand from "./commands/AddShapeCommand.js";
import RemoveShapeCommand from "./commands/RemoveShapeCommand.js";
import MoveShapeCommand from "./commands/MoveShapeCommand.js";
import AddShapeManager from "./managers/AddShapeManager.js";
import RemoveShapeManager from "./managers/RemoveShapeManager.js";
import SelectionManager from "./managers/SelectionManager.js";
import MoveShapeManager from "./managers/MoveShapeManager.js";
import CustomShape from "../models/CustomShape.js";
import Snap from "../models/OSnap.js";
import MouseTracker from "../models/MouseTracker.js";
import CommandBar from "../models/CommandBar.js";
export class ShapeController {
	constructor(gContainer, messageBarContainer, enterButtonCommandBar) {
		this.gContainer = gContainer;
		this.svgContainer = gContainer.parentElement;
		this.commandManager = new CommandManager();
		this.addShapeManager = new AddShapeManager();
		this.removeShapeManager = new RemoveShapeManager();
		this.selectionManager = new SelectionManager();
		this.moveShapeManager = new MoveShapeManager();
		// Snap and pointer
		this.snap = new Snap(this.gContainer);
		this.mouseTracker = new MouseTracker(gContainer);

		// Command Bar
		this.messageBarContainer = messageBarContainer;
		this.enterButtonCommandBar = enterButtonCommandBar;
		this.commandBar = new CommandBar(
			this.messageBarContainer,
			this.enterButtonCommandBar
		);

		this.listShapes = [];
	}

	get shapes() {
		return this.listShapes;
	}

	loadShapes() {
		const listShapesOnLC = JSON.parse(localStorage.getItem("shapes"));
		if (listShapesOnLC) {
			this.listShapes = listShapesOnLC.map((shapeData) => {
				const shape = new CustomShape(this.gContainer);
				shape.data = shapeData.data;
				shape.position = shapeData.position;
				shape.angle = shapeData.angle;
				shape.scale = shapeData.scale;
				shape.fill = shapeData.fill;
				shape.strokeColor = shapeData.strokeColor;
				shape.strokeWidth = shapeData.strokeWidth;
				shape.opacity = shapeData.opacity;
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
			opacity: shape.opacity,
			id: shape.id,
		}));
		localStorage.setItem("shapes", JSON.stringify(listObjectsShape));
	}

	selectShape(event) {
		if (this.selectionManager.selectMode === true) {
			const shapeElement = event.target;
			this.selectionManager.selectShape(shapeElement, this.listShapes, event);
			this.bringToFront();
		}
	}

	getSelectShape() {
		return this.selectionManager.selectedShapes;
	}
	addShape(shapeStrategy, dimensions, position) {
		const command = new AddShapeCommand(
			this.addShapeManager,
			this.listShapes,
			this.gContainer,
			shapeStrategy,
			dimensions,
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

	bringToFront() {
		const selectShapes = this.getSelectShape();
		selectShapes.map((shape) => {
			d3.select(shape.shape).raise();
		});
	}
	bringToBack() {
		const selectShapes = this.getSelectShape();
		selectShapes.map((shape) => {
			d3.select(shape.shape).lower();
		});
	}

	undo() {
		this.commandManager.undo();
	}

	redo() {
		this.commandManager.redo();
	}
}
