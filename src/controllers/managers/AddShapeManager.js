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
		const lastShape = listShapes[listShapes.length - 1];
		const newShape = new Shape(shapesScreen, data, position);
		newShape.id = lastShape ? lastShape.id + 1 : 1;
		listShapes.push(newShape);
		return newShape;
	}
	removeShape(listShapes, path) {
		const shape = listShapes.find((shape) => shape.path === path);
		if (shape) {
			shape.path.remove(); // Remove o elemento SVG
			listShapes = listShapes.filter((obj) => obj !== shape); // Remove da lista corretamente
		}
	}
}
