import Command from "./Command";

export default class AddShapeCommand extends Command {
	constructor(shapeManager, shapesScreen, shapeData) {
		super();
		this.shapesScreen = shapesScreen;
		this.shapeManager = shapeManager;
		this.shapedata = shapeData;
		this.shape = null;
	}
	execute() {
		this.shape = this.shapeManager.addShape(this.shapesScreen, this.shapeData);
	}
	undo() {
		if (this.shape) {
			this.shapeManager.removeShape(this.shape.path);
		}
	}
}
