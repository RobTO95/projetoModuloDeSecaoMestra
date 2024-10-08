import { Shape } from "../../models/shape";

export default class AddShapeManager {
	addShape(listShapes, shapesScreen, shapeData = null, position = null) {
		const data = shapeData || [
			[0, 0],
			[10, 0],
			[10, 90],
			[90, 90],
			[90, 100],
			[0, 100],
			[0, 0],
		];
		// Encontra o shape com o maior id na lista
		const maxIdShape = listShapes.reduce(
			(maxShape, currentShape) => {
				return currentShape.id > maxShape.id ? currentShape : maxShape;
			},
			{ id: 0 }
		); // Inicia com id 0 caso a lista esteja vazia

		// Cria um novo shape com o id incrementado
		const newShape = new Shape(shapesScreen, data, position);
		newShape.id = maxIdShape.id + 1; // Usa o maior id + 1
		listShapes.push(newShape);
		this.backUpShape = newShape;
		return newShape;
	}
	removeShape(listShapes, shape) {
		if (shape) {
			shape.removePath();
			listShapes.pop(shape); // Remove da lista corretamente
		}
	}
}
