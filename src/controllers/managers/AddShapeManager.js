import { Shape } from "../../models/shape";

export default class AddShapeManager {
	constructor() {
		this.listShapes = [];
	}
	addShape(shapesScreen, shapeData = null, position = null, event = null) {
		const data = shapeData || [
			[0, 0],
			[10, 0],
			[10, 90],
			[90, 90],
			[90, 100],
			[0, 100],
			[0, 0],
		];
		const newPosition = position;
		const newShape = new Shape(shapesScreen, data, newPosition);
		this.listShapes.push(newShape);
		return newShape;
	}
	removeShape(path) {
		const shape = this.listShapes.find((shape) => shape.path === path);
		if (shape) {
			shape.path.remove(); // Remove o elemento SVG
			this.listShapes = this.listShapes.filter((obj) => {
				obj !== shape;
			}); // Remove da lista
			return shape;
		}
	}
}
