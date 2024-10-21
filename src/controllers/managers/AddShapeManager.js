import { LShapedBeam, TShapeBeam } from "../../models/ShapesDefault";
export default class AddShapeManager {
	addShape(listShapes, shapesScreen, position = null) {
		// Encontra o shape com o maior id na lista
		const maxIdShape = listShapes.reduce(
			(maxShape, currentShape) => {
				return currentShape.id > maxShape.id ? currentShape : maxShape;
			},
			{ id: 0 }
		); // Inicia com id 0 caso a lista esteja vazia

		// Cria um novo shape com o id incrementado
		// const newShape = new LShapedBeam(
		// 	shapesScreen,
		// 	100,
		// 	100,
		// 	10,
		// 	10,
		// 	5,
		// 	10,
		// 	5,
		// 	10
		// );
		const newShape = new TShapeBeam(shapesScreen, 100, 10, 100, 10);

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
