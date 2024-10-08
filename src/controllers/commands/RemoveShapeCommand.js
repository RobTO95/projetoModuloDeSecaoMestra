import Command from "./Command";

export default class RemoveShapeCommand extends Command {
	constructor(shapeManager, selectedShapes, listShapes) {
		super();
		this.shapeManager = shapeManager;
		this.selectedShapes = selectedShapes;
		this.listShapes = listShapes;
		// this.shapeBackup = JSON.parse(JSON.stringify(selectedShapes)); // Clona os shapes selecionados para o backup
		this.shapeBackup = null; // Clona os shapes selecionados para o backup
	}

	execute() {
		if (!this.shapeBackup) {
			this.shapeBackup = [...this.selectedShapes];
			this.shapeManager.removeShape(this.selectedShapes, this.listShapes); // Remove os shapes selecionados
		} else {
			this.selectedShapes = [...this.shapeBackup];
			this.shapeManager.removeShape(this.selectedShapes, this.listShapes); // Remove os shapes selecionados
		}
	}

	undo() {
		this.shapeManager.addShape(this.listShapes, this.shapeBackup); // Restaura os shapes removidos
	}
}
