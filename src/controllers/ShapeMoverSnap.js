import * as d3 from "d3";
import { pointer } from "d3";
import Snap from "../models/OSnap";
import { getMouseSnapPosition } from "../utils/utils";
import MoveShapeCommand from "./commands/MoveShapeCommand";

export class ShapeMoverSnap {
	constructor(shapeController, callBackFuntion) {
		this.shapeController = shapeController;
		this.firstPosition = [];
		this.initialPointerPosition = [];
		this.lastPosition = [];
		this.svgContainer = this.shapeController.drawScreen;
		this.gContainer = this.shapeController.shapesScreen;
		this.callBackFuntion = callBackFuntion;

		this.startMove = this.startMove.bind(this);
		this.onMove = this.onMove.bind(this);
		this.stopMove = this.stopMove.bind(this);

		this.svgContainer.style.touchAction = "none";

		this.svgContainer.addEventListener("pointerdown", this.startMove);
	}

	startMove(event) {
		if (this.shapeController.getSelectShape().length === 0) {
			return;
		}
		const shapesSelect = this.shapeController.shapes;

		shapesSelect.forEach((shape) => {
			this.shapeController.snap.detectSnapPoints(shape);
		});

		const pointerPosition = {
			type: "",
			point: {
				x: pointer(event, this.gContainer)[0],
				y: pointer(event, this.gContainer)[1],
			},
		};
		const snapPosition = this.shapeController.snap.snapTo(
			pointerPosition.point
		);

		this.initialPointerPosition = snapPosition
			? [snapPosition.point.x, snapPosition.point.y]
			: [pointerPosition.point.x, pointerPosition.point.y];

		this.shapeController.snap.clearSnapPoints();
		const shapes = this.shapeController.shapes.filter(
			(shape) => !this.shapeController.getSelectShape().includes(shape)
		);
		shapes.forEach((shape) => {
			this.shapeController.snap.detectSnapPoints(shape);
		});

		this.svgContainer.addEventListener("pointermove", this.onMove);
		this.svgContainer.addEventListener("pointerdown", this.stopMove);
		this.firstPosition = [
			this.initialPointerPosition[0],
			this.initialPointerPosition[1],
		];
	}
	onMove(event) {
		// this.svgContainer.removeEventListener("pointerdown", this.startMove);

		const pointerPosition = {
			type: "",
			point: {
				x: pointer(event, this.gContainer)[0],
				y: pointer(event, this.gContainer)[1],
			},
		};
		const snapPosition = this.shapeController.snap.snapTo(
			pointerPosition.point
		);
		const currentPointerPosition = snapPosition
			? [snapPosition.point.x, snapPosition.point.y]
			: [pointerPosition.point.x, pointerPosition.point.y];

		// Calcula o deslocamento do ponteiro em relação à posição inicial.
		const dx = currentPointerPosition[0] - this.initialPointerPosition[0];
		const dy = currentPointerPosition[1] - this.initialPointerPosition[1];

		// Atualiza a posição de cada shape selecionado.
		this.shapeController.getSelectShape().forEach((shape) => {
			shape.position = [shape.position[0] + dx, shape.position[1] + dy];
			shape.updatePath(); // Método que atualiza o caminho do SVG.
		});
		// Atualiza a posição inicial para o próximo movimento.
		this.initialPointerPosition = currentPointerPosition;
	}
	stopMove(event) {
		const pointerPosition = {
			type: "",
			point: {
				x: pointer(event, this.gContainer)[0],
				y: pointer(event, this.gContainer)[1],
			},
		};
		const snapPosition = this.shapeController.snap.snapTo(
			pointerPosition.point
		);
		this.lastPosition = snapPosition
			? [snapPosition.point.x, snapPosition.point.y]
			: [pointerPosition.point.x, pointerPosition.point.y];

		// Se houve movimentação, cria um comando para armazenar no stack de Undo.
		if (
			this.firstPosition[0] !== this.lastPosition[0] ||
			this.firstPosition[1] !== this.lastPosition[1]
		) {
			const command = new MoveShapeCommand(
				this.shapeController.moveShapeManager,
				this.shapeController.getSelectShape(),
				this.firstPosition,
				this.lastPosition
			);
			this.shapeController.commandManager.undoStack.push(command);
		}
		// Atualiza o estado dos botões de Undo e Redo.
		this.callBackFuntion();

		this.svgContainer.removeEventListener("pointermove", this.onMove);
		this.svgContainer.removeEventListener("pointerdown", this.stopMove);
		this.svgContainer.removeEventListener("pointercancel", this.stopMove);
	}
}
