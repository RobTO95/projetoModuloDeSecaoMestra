import Command from "./Command";

export default class AddShapeCommand extends Command {
	constructor(shapeManager, listShapes, shapesScreen, shapeData, position) {
		super();
		this.shapeManager = shapeManager;
		this.listShapes = listShapes;
		this.shapesScreen = shapesScreen;
		this.shapeData = shapeData;
		this.position = position;
		this.backupShape = null;
	}
	execute() {
		if (!this.backupShape) {
			this.backupShape = this.shapeManager.addShape(
				this.listShapes,
				this.shapesScreen,
				this.position
			);
		} else {
			this.backupShape.updatePath();
			this.listShapes.push(this.backupShape);
		}
	}
	undo() {
		if (this.backupShape) {
			this.shapeManager.removeShape(this.listShapes, this.backupShape);
		}
	}
}
