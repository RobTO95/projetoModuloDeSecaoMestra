import Command from "./Command";

export default class RemoveShapeCommand extends Command {
	constructor(shapeManager, shapeId) {
		super();
		this.shapeManager = shapeManager;
		this.shapeId = shapeId;
		this.shapeBackup = null;
	}

	execute() {
		this.shapeBackup = this.shapeManager.getShape(this.shapeId); // Salva o shape antes de remover
		this.shapeManager.removeShape(this.shapeId);
	}

	undo() {
		if (this.shapeBackup) {
			this.shapeManager.addShape(this.shapeBackup.data); // Desfaz a remoção restaurando o shape
		}
	}
}
