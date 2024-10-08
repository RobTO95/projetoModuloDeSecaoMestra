export default class RemoveShapeManager {
	constructor() {}

	removeShape(selectedShapes = [], listShapes = []) {
		selectedShapes.forEach((shape) => {
			shape.removePath(); // Remove o elemento SVG
			let indexShape = listShapes.indexOf(shape);
			if (indexShape > -1) {
				listShapes.splice(indexShape, 1);
			}
		});
		// Limpa a seleção após a remoção
		selectedShapes.length = 0;
	}

	addShape(listShapes, shapeBackup) {
		shapeBackup.forEach((shape) => {
			listShapes.push(shape); // Adiciona de volta à lista original
			shape.updatePath(); // Atualiza o path no SVG
		});
	}
}
