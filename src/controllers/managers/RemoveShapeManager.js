export default class RemoveShapeManager {
	constructor() {}
	// removeShape() {
	// 	throw new Error("Implementar comando removeShape em RemoveShapeManager");
	// }
	removeShape(listShapes, path) {
		const shape = listShapes.find((shape) => shape.path === path);
		if (shape) {
			shape.path.remove(); // Remove o elemento SVG
			listShapes = listShapes.filter((obj) => obj !== shape); // Remove da lista corretamente
			return shape;
		}
	}
}
