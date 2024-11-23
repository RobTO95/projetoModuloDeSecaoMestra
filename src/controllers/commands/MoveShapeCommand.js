import Command from "./Command";

export default class MoveShapeCommand extends Command {
	constructor(shapeManager, selectedShapes, firstPosition, lastPosition) {
		super();
		this.shapeManager = shapeManager;
		this.selectedShapes = selectedShapes;
		this.firstPosition = firstPosition;
		this.lastPosition = lastPosition;
	}

	execute() {
		this.shapeManager.move(
			this.selectedShapes,
			this.firstPosition,
			this.lastPosition
		);
	}

	undo() {
		this.shapeManager.move(
			this.selectedShapes,
			this.lastPosition,
			this.firstPosition
		);
	}
}
