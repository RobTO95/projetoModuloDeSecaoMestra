import { Shape } from "../models/shape.js";
import { getMousePosition } from "../utils/utils.js";

export class AddShapeManager {
	#shapesScreen;
	#drawScreen;
	#gridSize;
	#listShapes;
	#isAdding = false; // Estado do modo de adição

	constructor(shapesScreen, drawScreen, gridSize) {
		this.#shapesScreen = shapesScreen;
		this.#drawScreen = drawScreen;
		this.#gridSize = gridSize;
		this.#listShapes = [];
	}

	get isAdding() {
		return this.#isAdding;
	}

	set listShapes(list) {
		this.#listShapes = list;
	}

	get listShapes() {
		return this.#listShapes;
	}

	startAddingMode() {
		this.#drawScreen.style.cursor = "none";
		this.#isAdding = true;
	}

	exitAddingMode(event) {
		this.#drawScreen.style.cursor = "default";
		this.#isAdding = false;
	}

	addShape(event) {
		this.startAddingMode();

		const listPath = [
			[0, 0],
			[10, 0],
			[10, 90],
			[90, 90],
			[90, 100],
			[0, 100],
			[0, 0],
		];

		const temporaryShape = new Shape(this.#shapesScreen);

		const moveTemporaryShape = (event) => {
			temporaryShape.data = listPath;
			temporaryShape.position = getMousePosition(
				this.#drawScreen,
				this.#gridSize,
				event
			);
		};

		this.#drawScreen.addEventListener("mousemove", moveTemporaryShape);

		const handleClick = (event) => {
			const newShape = new Shape(this.#shapesScreen);
			newShape.data = listPath;
			newShape.position = getMousePosition(
				this.#drawScreen,
				this.#gridSize,
				event
			);
			const lastShape = this.#listShapes[this.#listShapes.length - 1];
			newShape.id = lastShape ? lastShape.id + 1 : 1;
			newShape.path.attr("id", `shape-${newShape.id}`);
			this.listShapes.push(newShape); // Adiciona o novo shape à lista
		};
		this.#drawScreen.addEventListener("click", handleClick);

		const exitMode = (event) => {
			this.exitAddingMode();
			temporaryShape.path.remove();
			this.#drawScreen.removeEventListener("mousemove", moveTemporaryShape);

			this.#drawScreen.removeEventListener("click", handleClick);
			window.removeEventListener("keydown", exitMode);
		};

		window.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				exitMode();
			}
		});
	}
}
