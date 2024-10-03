export default class RemoveShapeManager {
	constructor() {}

	removeShape(selectedShapes = [], listShapes = []) {
		selectedShapes.forEach((shape) => {
			shape.removePath(); // Remove o elemento SVG
			const index = listShapes.indexOf(shape);
			if (index !== -1) {
				listShapes.splice(index, 1); // Remove o shape da lista original
			}
		});
	}

	addShape(listShapes, shapeBackup = []) {
		shapeBackup.forEach((shape) => {
			listShapes.push(shape); // Adiciona de volta à lista original
			shape.updatePath(); // Atualiza o path no SVG
		});
	}
}
