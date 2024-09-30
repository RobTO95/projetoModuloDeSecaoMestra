import Command from "./Command";

export default class RemoveShapeCommand extends Command {
	constructor(shapeManager, selectedShapes = [], listShapes) {
		super();
		this.shapeManager = shapeManager;
		this.selectedShapes = selectedShapes;
		this.listShapes = listShapes;
		this.shapeBackup = [...selectedShapes]; // Clona os shapes selecionados para o backup
	}

	execute() {
		this.shapeManager.removeShape(this.selectedShapes, this.listShapes); // Remove os shapes selecionados
	}

	undo() {
		if (this.shapeBackup.length > 0) {
			this.shapeManager.addShape(this.listShapes, this.shapeBackup); // Restaura os shapes removidos
		}
	}
}
