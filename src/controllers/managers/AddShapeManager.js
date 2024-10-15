import CustomShape from "../../models/CustomShape";

export default class AddShapeManager {
	addShape(listShapes, shapesScreen, shapeData = null, position = null) {
		// Encontra o shape com o maior id na lista
		const maxIdShape = listShapes.reduce(
			(maxShape, currentShape) => {
				return currentShape.id > maxShape.id ? currentShape : maxShape;
			},
			{ id: 0 }
		); // Inicia com id 0 caso a lista esteja vazia

		// Cria um novo shape com o id incrementado
		const newShape = new CustomShape(shapesScreen);

		newShape.anchor(0, 0);
		newShape.line(100, 0);
		newShape.line(100, 10);
		// newShape.arcTo(10, 10, 10, 15, 10);
		newShape.line(10, 10);
		newShape.line(10, 100);
		newShape.line(0, 100);
		newShape.close();
		newShape.id = maxIdShape.id + 1; // Usa o maior id + 1

		newShape.position = position || newShape.position;

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
