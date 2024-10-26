import Command from "./Command";

export default class AddShapeCommand extends Command {
	constructor(
		shapeManager,
		listShapes,
		shapesScreen,
		shapeStrategy,
		dimensions,
		position
	) {
		super();
		this.shapeManager = shapeManager;
		this.listShapes = listShapes;
		this.shapesScreen = shapesScreen;
		this.shapeStrategy = shapeStrategy;
		this.dimensions = dimensions;
		this.position = position;
		this.backupShape = null;
	}
	execute() {
		if (!this.backupShape) {
			this.backupShape = this.shapeManager.addShape(
				this.listShapes,
				this.shapesScreen,
				this.shapeStrategy,
				this.dimensions,
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
