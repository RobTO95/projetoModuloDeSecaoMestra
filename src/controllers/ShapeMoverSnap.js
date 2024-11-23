import { pointer } from "d3";
import MoveShapeCommand from "./commands/MoveShapeCommand";

/**
 * Classe responsável por mover shapes com suporte a *snap* no SVG.
 *
 * Permite o movimento de shapes selecionados com precisão, ajustando a posição
 * com base em pontos de *snap* próximos (e.g., pontos médios, extremidades) e
 * registra cada movimento em uma pilha de comandos para suporte a Undo/Redo.
 */
export class ShapeMoverSnap {
	constructor(shapeController, callBackFunction) {
		this.shapeController = shapeController;
		this.firstPosition = null;
		this.initialPointerPosition = null;
		this.lastPosition = null;
		this.svgContainer = this.shapeController.svgContainer;
		this.gContainer = this.shapeController.gContainer;
		this.callBackFunction = callBackFunction;

		this.svgContainer.style.touchAction = "none";

		// Liga os métodos para manter o contexto da instância.
		this.startMove = this.startMove.bind(this);
		this.onMove = this.onMove.bind(this);
		this.stopMove = this.stopMove.bind(this);

		// Inicia o evento de movimento ao pressionar no SVG.
		this.svgContainer.addEventListener("pointerdown", this.startMove);
	}

	/**
	 * Inicia o movimento de shapes selecionados e configura os pontos de snap.
	 *
	 * @param {PointerEvent} event - Evento de início de movimento (pointerdown).
	 */
	startMove(event) {
		if (this.shapeController.getSelectShape().length === 0) return;

		this.shapeController.snap.onSnap();
		console.log(this.shapeController.snap.snapOn);
		const pointerPosition = this.shapeController.mouseTracker.mousePosition;

		this.initialPointerPosition = [pointerPosition.x, pointerPosition.y];

		// Ativa snap
		this.shapeController;
		// Adiciona eventos para monitorar movimento e término.

		this.svgContainer.addEventListener("pointermove", this.onMove);
		this.svgContainer.addEventListener("pointerdown", this.stopMove);

		if (!this.firstPosition) {
			this.firstPosition = [...this.initialPointerPosition];
		}
	}

	/**
	 * Executa o movimento dos shapes conforme o cursor se move, ajustando a posição ao *snap*.
	 *
	 * @param {PointerEvent} event - Evento de movimento do cursor (pointermove).
	 */
	onMove(event) {
		const pointerPosition = this._getEventPointerPosition(event);
		const snapPosition = this.shapeController.snap.snapTo(pointerPosition);

		const currentPointerPosition = snapPosition
			? [snapPosition.point.x, snapPosition.point.y]
			: [pointerPosition.x, pointerPosition.y];

		// Calcula o deslocamento do cursor e move os shapes selecionados.
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

	/**
	 * Conclui o movimento e cria um comando para Undo/Redo se houve deslocamento.
	 *
	 * @param {PointerEvent} event - Evento de finalização do movimento (pointerdown).
	 */
	stopMove(event) {
		const pointerPosition = this._getEventPointerPosition(event);
		const snapPosition = this.shapeController.snap.snapTo(pointerPosition);

		this.lastPosition = snapPosition
			? [snapPosition.point.x, snapPosition.point.y]
			: [pointerPosition.x, pointerPosition.y];

		if (
			this.firstPosition &&
			(this.firstPosition[0] !== this.lastPosition[0] ||
				this.firstPosition[1] !== this.lastPosition[1])
		) {
			const command = new MoveShapeCommand(
				this.shapeController.moveShapeManager,
				this.shapeController.getSelectShape(),
				this.firstPosition,
				this.lastPosition
			);
			this.shapeController.commandManager.undoStack.push(command);
		}

		this._resetState();
		this.callBackFunction();
	}

	/**
	 * Obtem a posição do ponteiro do evento, relativa ao contêiner SVG.
	 *
	 * @param {PointerEvent} event - Evento do ponteiro.
	 * @returns {Object} - A posição do ponteiro com as propriedades { x, y }.
	 */
	_getEventPointerPosition(event) {
		return {
			x: pointer(event, this.gContainer)[0],
			y: pointer(event, this.gContainer)[1],
		};
	}

	/**
	 * Reseta as variáveis de estado e remove os event listeners de movimento.
	 */
	_resetState() {
		this.firstPosition = null;
		this.initialPointerPosition = null;
		this.lastPosition = null;

		this.svgContainer.removeEventListener("pointermove", this.onMove);
		this.svgContainer.removeEventListener("pointerdown", this.stopMove);
	}
}
