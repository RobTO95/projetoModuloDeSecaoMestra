import { svg } from "d3";
import { getMousePosition } from "../utils/utils";
import MoveShapeCommand from "./commands/MoveShapeCommand";
import CustomShape from "../models/CustomShape";
import LineFeedBack from "../models/LineFeedBack";

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
		this.copyMove = null;
		this.startMove = this.startMove.bind(this);
		this.onMove = this.onMove.bind(this);
		this.stopMove = this.stopMove.bind(this);
		this._moveShapes = this._moveShapes.bind(this);
		this.lineFeedBack = new LineFeedBack(this.gContainer);
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
		this.commandBar.writeMessage("Point to move from:");
		this.commandBar.visibleOn();
		this.snap.onSnap();
		this.svgContainer.addEventListener("pointerup", this.onMove);
		this.copyMove = this.shapeController.selectionManager.getCopy();
		this.shapeController.getSelectShape().map((element) => {
			element.opacity = 0.2;
		});
	}

	onMove() {
		this.commandBar.writeMessage("Point to move to:");
		this.initialPointerPosition = this._getPosition();
		this.firstPosition = this.firstPosition
			? this.firstPosition
			: [...this.initialPointerPosition];
		// Line feedback
		this.lineFeedBack.firstPosition = {
			x: this.firstPosition[0],
			y: this.firstPosition[1],
		};

		this.svgContainer.removeEventListener("pointerup", this.onMove);
		this.svgContainer.addEventListener("pointermove", this._moveShapes);
		this.svgContainer.addEventListener("pointerup", this.stopMove);
	}

	stopMove() {
		this.lastPosition = this._getPosition();

		if (
			this.firstPosition &&
			(this.firstPosition[0] !== this.lastPosition[0] ||
				this.firstPosition[1] !== this.lastPosition[1])
		) {
			this.shapeController.moveShape(this.firstPosition, this.lastPosition);
		}
		this.commandBar.clear();
		this.commandBar.visibleOff();
		this.moveMode = false;
		this.selectionManager.selectMode = true;
		this.copyMove.map((copy) => {
			copy.shape.remove();
		});
		this.stopCommand();
		this.callBackFunction();
	}

	stopCommand() {
		this.initialPointerPosition = null;
		this.currentPointerPosition = null;
		this.firstPosition = null;
		this.copyMove = null;
		this.snap.offSnap();
		this.snap.clearSnapPoints();
		this.shapeController.getSelectShape().map((element) => {
			element.opacity = 1;
		});
		this.lineFeedBack.clear();
		this.svgContainer.removeEventListener("pointermove", this._moveShapes);
		this.svgContainer.removeEventListener("pointerup", this.onMove);
		this.svgContainer.removeEventListener("pointerup", this.stopMove);
	}
	_moveShapes(event) {
		// Calcula o deslocamento do cursor e move os shapes selecionados.
		const currentPointerPosition = this._getPosition();
		const [dx, dy] = [
			currentPointerPosition[0] - this.initialPointerPosition[0],
			currentPointerPosition[1] - this.initialPointerPosition[1],
		];

		this.copyMove.forEach((shape) => {
			shape.position = [shape.position[0] + dx, shape.position[1] + dy];
			shape.updatePath(); // Método que atualiza o caminho do SVG.
		});
		this.lineFeedBack.lastPosition = {
			x: currentPointerPosition[0],
			y: currentPointerPosition[1],
		};
		this.lineFeedBack.updateLine();
		// console.log(this.lineFeedBack.lastPosition);

		this.initialPointerPosition = [...currentPointerPosition];
	}
	_getPosition() {
		const mousePosition = this.shapeController.mouseTracker.mousePosition;
		const position = [mousePosition.x, mousePosition.y];
		return position;
	}
}
