import { getMousePosition } from "../utils/utils";
import MoveShapeCommand from "./commands/MoveShapeCommand";

export default class ShapeMover {
	constructor(shapeController, callBackFunction = () => {}) {
		this.shapeController = shapeController;
		this.callBackFunction = callBackFunction;
		this.firstPosition = null;
		this.initialPointerPosition = null;
		this.lastPosition = null;
		this.svgContainer = this.shapeController.svgContainer;
		this.gContainer = this.shapeController.gContainer;
		this.callBackFunction = callBackFunction;
	}
	startMove() {}
	onMove() {}
	stopMove() {}
}
