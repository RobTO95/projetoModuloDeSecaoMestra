import Command from "./Command";

export default class AddShapeCommand extends Command {
	constructor(shapeManager, listShapes, shapesScreen, shapeData, position) {
		super();
		this.shapeManager = shapeManager;
		this.listShapes = listShapes;
		this.shapesScreen = shapesScreen;
		this.shapeData = shapeData;
		this.position = position;
		this.shape = null;
	}
	execute() {
		this.shape = this.shapeManager.addShape(
			this.listShapes,
			this.shapesScreen,
			this.shapeData,
			this.position
		);
	}
	undo() {
		if (this.shape) {
			this.shapeManager.removeShape(this.listShapes, this.shape.path);
		}
	}
}
