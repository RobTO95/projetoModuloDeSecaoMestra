class ShapeStrategy {
	createShape(drawScreen, position) {
		throw new Error("This method must be overridden by subclasses");
	}
}
