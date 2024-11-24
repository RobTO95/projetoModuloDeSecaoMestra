import { svg } from "d3";
import { getMousePosition } from "../utils/utils";
import MoveShapeCommand from "./commands/MoveShapeCommand";

export default class ShapeMover {
	constructor(shapeController, callBackFunction = () => {}) {
		this.shapeController = shapeController;
		this.commandBar = this.shapeController.commandBar;
		this.callBackFunction = callBackFunction;
		this.firstPosition = null;
		this.initialPointerPosition = null;
		this.lastPosition = null;
		this.svgContainer = this.shapeController.svgContainer;
		this.gContainer = this.shapeController.gContainer;
		this.snap = this.shapeController.snap;
		this.selectionManager = this.shapeController.selectionManager;
		this.callBackFunction = callBackFunction;
		this.moveMode = false;
		this.startMove = this.startMove.bind(this);
		this.onMove = this.onMove.bind(this);
		this.stopMove = this.stopMove.bind(this);
		this._moveShapes = this._moveShapes.bind(this);
	}
	startMove() {
		if (this.moveMode) {
			return;
		}
		const selectShapes = this.shapeController.getSelectShape();
		if (selectShapes.length === 0) {
			return;
		}

		this.selectionManager.selectMode = false;
		this.commandBar.writeMessage("Select the reference point");
		this.commandBar.visibleOn();
		this.snap.onSnap();
		this.svgContainer.addEventListener("pointerup", this.onMove);
	}

	onMove() {
		this.initialPointerPosition = this._getPosition();
		this.firstPosition = this._getPosition();
		this.selectionManager.pointerEvents = false;
		this.svgContainer.addEventListener("pointermove", this._moveShapes);
		this.svgContainer.addEventListener("pointerdown", this.stopMove);
	}

	stopMove() {
		this.moveMode = false;
		this.selectionManager.selectMode = true;
		this.selectionManager.pointerEvents = true;
		this.snap.offSnap();
		this.svgContainer.removeEventListener("pointermove", this._moveShapes);
		this.svgContainer.removeEventListener("pointerup", this.onMove);
		this.svgContainer.removeEventListener("pointerdown", this.stopMove);
	}
	_moveShapes(event) {
		// Calcula o deslocamento do cursor e move os shapes selecionados.
		const currentPointerPosition = this._getPosition();
		const [dx, dy] = [
			currentPointerPosition[0] - this.initialPointerPosition[0],
			currentPointerPosition[1] - this.initialPointerPosition[1],
		];
		this.shapeController.getSelectShape().forEach((shape) => {
			shape.position = [shape.position[0] + dx, shape.position[1] + dy];
			shape.updatePath(); // Método que atualiza o caminho do SVG.
		});
		this.initialPointerPosition = [...currentPointerPosition];
	}
	_getPosition() {
		const mousePosition = this.shapeController.mouseTracker.mousePosition;
		const position = [mousePosition.x, mousePosition.y];
		return position;
	}
}
