export class RemoveShapeManager {
	#listShapes = []; // Propriedade privada para armazenar a lista de shapes

	set listShapes(list) {
		this.#listShapes = list;
	}

	get listShapes() {
		return this.#listShapes;
	}

	removeShape(selectedShapes) {
		selectedShapes.forEach((shape) => {
			this.deletePath(shape);
		});
		this.#listShapes = this.#listShapes.filter(
			(shape) => !selectedShapes.includes(shape)
		);
	}

	deletePath(shapeObject) {
		const path = shapeObject.path.node();
		path.remove();
	}
}
