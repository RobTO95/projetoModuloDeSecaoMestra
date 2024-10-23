import { LShapedBeam, TShapeBeam } from "./ShapesDefault";

export default class ShapeStrategy {
	createShape(drawScreen, position) {
		throw new Error("This method must be overridden by subclasses");
	}
}

export class LShapeStrategy extends ShapeStrategy {
	createShape(drawScreen, dimensions) {
		const {
			legLength1,
			legLength2,
			thickness1,
			thickness2,
			radius1,
			radius2,
			radius3,
			radius4,
		} = dimensions;
		return new LShapedBeam(
			drawScreen,
			legLength1,
			legLength2,
			thickness1,
			thickness2,
			radius1,
			radius2,
			radius3,
			radius4
		);
	}
}

export class TShapeStrategy extends ShapeStrategy {
	createShape(drawScreen, dimensions) {
		const { soulLength, soulThickness, flangeLength, flangeThickness } =
			dimensions;
		return new TShapeBeam(
			drawScreen,
			soulLength,
			soulThickness,
			flangeLength,
			flangeThickness
		);
	}
}