import { LShapeBeam, TShapeBeam } from "../../models/ShapesDefault";
import { LShapeStrategy, TShapeStrategy } from "../../models/ShapeStrategy";
export default class AddShapeManager {
	constructor(shapeStrategy) {
		this.shapeStrategy = shapeStrategy; // Estratégia de shape escolhida
	}

	setShapeStrategy(shapeStrategy) {
		this.shapeStrategy = shapeStrategy;
	}

	addShape(
		listShapes,
		shapesScreen,
		shapeStrategy,
		dimensions,
		position = null
	) {
		if (shapeStrategy) {
			this.setShapeStrategy(shapeStrategy);
		}
		// Encontra o shape com o maior id na lista
		const maxIdShape = listShapes.reduce(
			(maxShape, currentShape) =>
				currentShape.id > maxShape.id ? currentShape : maxShape,
			{ id: 0 }
		);

		// Cria um novo shape com a estratégia selecionada
		const newShape = this.shapeStrategy.createShape(shapesScreen, dimensions);
		newShape.id = maxIdShape.id + 1;
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
