export class SelectionManager {
	#strokeColor = "";
	#strokeColorSeleted = "yellow";

	constructor() {
		this.selectedShapes = [];
	}

	selectShape(shapeElement, listShapes, event) {
		if (shapeElement.tagName === "path") {
			const idShape = shapeElement.id.replace("shape-", "");
			const clickedShape = listShapes.find((shape) => shape.id == idShape);

			const isMultiSelect = event.ctrlKey || event.metaKey;

			if (this.selectedShapes.includes(clickedShape)) {
				if (isMultiSelect) {
					this.selectedShapes = this.selectedShapes.filter(
						(shape) => shape !== clickedShape
					);
					console.log(clickedShape);
					clickedShape.strokeColor = this.#strokeColor;
				}
			} else {
				if (isMultiSelect) {
					this.selectedShapes.push(clickedShape);
				} else {
					this.deselectAllShapes();
					this.selectedShapes = [clickedShape];
				}
				clickedShape.strokeColor = this.#strokeColorSeleted;
			}
		} else {
			this.deselectAllShapes();
		}
	}

	deselectAllShapes() {
		this.selectedShapes.forEach((shape) => {
			shape.strokeColor = this.#strokeColor;
		});
		this.selectedShapes = [];
	}

	isThereShapeSelected() {
		return this.selectedShapes.length !== 0;
	}
}
