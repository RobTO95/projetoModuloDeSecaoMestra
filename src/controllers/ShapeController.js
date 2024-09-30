import CommandManager from "./commands/CommandManager.js";
import AddShapeCommand from "./commands/AddShapeCommand.js";
import RemoveShapeCommand from "./commands/RemoveShapeCommand.js";
import AddShapeManager from "./managers/AddShapeManager.js";
import RemoveShapeManager from "./managers/RemoveShapeManager.js";
import SelectionManager from "./managers/SelectionManager.js";

export class ShapeController {
	constructor(drawScreen, shapesScreen) {
		this.drawScreen = drawScreen;
		this.shapesScreen = shapesScreen;

		this.commandManager = new CommandManager();
		this.addShapeManager = new AddShapeManager();
		this.removeShapeManager = new RemoveShapeManager();
		this.selectionManager = new SelectionManager();
		this.listShapes = [];
	}
	selectShape(event) {
		const shapeElement = event.target;
		this.selectionManager.selectShape(shapeElement, this.listShapes, event);
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

	undo() {
		this.commandManager.undo();
	}

	redo() {
		this.commandManager.redo();
	}
}
