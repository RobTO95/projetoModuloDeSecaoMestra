import Command from "./Command";

export default class MoveShapeCommand extends Command {
	constructor(shapeManager, selectedShapes, firstPosition, lastPosition) {
		super();
		this.shapeManager = shapeManager;
		this.selectedShapes = selectedShapes;
		this.firstPosition = firstPosition;
		this.lastPosition = lastPosition;
		// this.shapeBackup = selectedShapes.map((shape) => ({ ...shape })); // Faz backup das propriedades necessárias
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
