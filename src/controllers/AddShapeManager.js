import { Shape } from "../models/shape.js";
import { getMousePosition } from "../utils/utils.js";

export class AddShapeManager {
	constructor(shapesScreen, drawScreen, gridSize) {
		this.shapesScreen = shapesScreen;
		this.drawScreen = drawScreen;
		this.gridSize = gridSize;
		this.listShapes = [];
	}

	addShape() {
		const listPath = [
			[0, 0],
			[10, 0],
			[10, 90],
			[90, 90],
			[90, 100],
			[0, 100],
			[0, 0],
		];

		const newShape = new Shape(this.shapesScreen);

		const moveShape = (event) => {
			newShape.data = listPath;
			newShape.position = getMousePosition(
				this.drawScreen,
				this.gridSize,
				event
			);
		};

		this.drawScreen.addEventListener("mousemove", moveShape);

		const handleClick = (event) => {
			newShape.position = getMousePosition(
				this.drawScreen,
				this.gridSize,
				event
			);
			this.drawScreen.removeEventListener("mousemove", moveShape);
			this.drawScreen.removeEventListener("click", handleClick);
		};
		this.drawScreen.addEventListener("click", handleClick);

		const lastShape = this.listShapes[this.listShapes.length - 1];
		newShape.id = lastShape ? lastShape.id + 1 : 1;
		newShape.path.attr("id", `shape-${newShape.id}`);
		this.listShapes.push(newShape);
	}
}
