export default class MoveShapeManager {
	move(selectedShapes, firstPosition, lastPosition) {
		const newPosition = [
			lastPosition[0] - firstPosition[0],
			lastPosition[1] - firstPosition[1],
		];

		selectedShapes.forEach((shape) => {
			// Atualize a posição do shape
			const x = shape.position[0];
			const y = shape.position[1];
			shape.position = [x + newPosition[0], y + newPosition[1]];
		});
	}
}
