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
	}
	selectShape(event) {
		throw "Implementar selectShape em ShapeController";
		// if (!this.addShapeManager.isAdding) {
		// 	const shapeElement = event.target;
		// 	this.selectionManager.selectShape(
		// 		shapeElement,
		// 		this.addShapeManager.listShapes,
		// 		event
		// 	);
		// }
	}

	addShape(shapeData) {
		const command = new AddShapeCommand(
			this.addShapeManager,
			this.shapesScreen,
			shapeData
		);
		this.commandManager.executeCommand(command);
	}

	removeShape() {
		const selectedShape = this.selectionManager.getSelectedShape();
		if (selectedShape) {
			const command = new RemoveShapeCommand(
				this.removeShapeManager,
				selectedShape.id
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
