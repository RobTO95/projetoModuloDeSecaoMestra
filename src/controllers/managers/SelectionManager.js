export default class SelectionManager {
	constructor() {
		this.selectedShapes = [];
	}
	getSelectedShape() {
		return this.selectedShapes;
	}

	// Seleciona um shape
	selectShape(shapeElement, listShapes = [], event) {
		const shape = listShapes.find(
			(shape) => shape.id === Number(shapeElement.id.replace("shape-", ""))
		);
		if (shape) {
			if (event.ctrlKey || event.metaKey) {
				this.toggleSelection(shape); // Seleção múltipla com Ctrl ou Cmd
			} else {
				this.clearSelection(); // Limpa seleção atual se não houver múltipla seleção
				this.addToSelection(shape);
			}
		} else {
			this.deselectAllShapes();
		}
	}

	// Adiciona um shape à seleção
	addToSelection(shape) {
		if (!this.selectedShapes.includes(shape)) {
			this.selectedShapes.push(shape);
			shape.path.classed("selected", true); // Aplica classe CSS para visualização
		}
	}

	// Remove um shape da seleção
	removeFromSelection(shape) {
		const index = this.selectedShapes.indexOf(shape);
		if (index > -1) {
			this.selectedShapes.splice(index, 1);
			shape.path.classed("selected", false);
		}
	}

	// Alterna a seleção de um shape
	toggleSelection(shape) {
		if (this.selectedShapes.includes(shape)) {
			this.removeFromSelection(shape);
		} else {
			this.addToSelection(shape);
		}
	}

	// Limpa toda a seleção
	clearSelection() {
		this.selectedShapes.forEach((shape) => {
			if (shape.path) {
				// Verifique se o path ainda existe
				shape.path.classed("selected", false);
			}
		});
		this.selectedShapes = [];
	}

	// Verifica se há shapes selecionados
	isThereShapeSelected() {
		return this.selectedShapes.length > 0;
	}

	// Deseleciona todos os shapes
	deselectAllShapes() {
		this.clearSelection();
	}
}
