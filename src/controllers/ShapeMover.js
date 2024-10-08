// Funciona para dispositivos móveis e pc's
import { getDrawScreenDimensions, getMousePosition } from "../utils/utils";
import MoveShapeCommand from "./commands/MoveShapeCommand";

/**
 * Classe responsável por mover shapes SVG dentro de uma tela de desenho
 * utilizando eventos de mouse ou touch (suporte para dispositivos móveis).
 */
export default class ShapeMover {
	/**
	 * @constructor
	 * @param {SVGElement} drawScreen - O elemento SVG onde os shapes são desenhados.
	 * @param {Object} shapeController - Controlador responsável por gerenciar os shapes.
	 * @param {number} gridSize - O tamanho da grade para alinhamento dos shapes.
	 * @param {Function} updateUndoRedoButtons - Função que atualiza o estado dos botões de Undo e Redo.
	 */
	constructor(drawScreen, shapeController, gridSize, updateUndoRedoButtons) {
		this.drawScreen = drawScreen;
		this.shapeController = shapeController;
		this.gridSize = gridSize;
		this.selectedShapes = null; // Array de shapes atualmente selecionados para mover.
		this.initialPointerPosition = null; // Posição inicial do ponteiro (mouse ou toque).
		this.firstPosition = []; // Armazena a primeira posição do ponteiro ao iniciar o movimento.
		this.updateUndoRedoButtons = updateUndoRedoButtons; // Função para atualizar o estado dos botões de desfazer/refazer.

		// Bind dos métodos para garantir o contexto correto durante os eventos.
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);

		// Desativa o comportamento padrão de zoom e rolagem no mobile.
		this.drawScreen.style.touchAction = "none";

		// Adiciona o evento para início do movimento (suporta mouse e touch).
		this.drawScreen.addEventListener("pointerdown", this.onPointerDown);
	}

	/**
	 * Manipulador de eventos para mover shapes em tempo real.
	 * Calcula o deslocamento do ponteiro e atualiza a posição dos shapes.
	 *
	 * @param {PointerEvent} event - O evento de movimento do ponteiro (mouse ou touch).
	 */
	onPointerMove(event) {
		event.preventDefault(); // Previne o comportamento padrão do navegador em dispositivos móveis.

		// Obtém a nova posição do ponteiro (mouse ou touch).
		const currentPointerPosition = this.getPointerPosition(event);

		// Calcula o deslocamento do ponteiro em relação à posição inicial.
		const dx = currentPointerPosition[0] - this.initialPointerPosition[0];
		const dy = currentPointerPosition[1] - this.initialPointerPosition[1];

		// Atualiza a posição de cada shape selecionado.
		this.selectedShapes.forEach((shape) => {
			shape.position = [shape.position[0] + dx, shape.position[1] + dy];
			shape.updatePath(); // Método que atualiza o caminho do SVG.
		});

		// Atualiza a posição inicial para o próximo movimento.
		this.initialPointerPosition = currentPointerPosition;
	}

	/**
	 * Manipulador de eventos para iniciar o movimento dos shapes.
	 * Armazena a posição inicial e habilita o evento de movimento.
	 *
	 * @param {PointerEvent} event - O evento de toque ou clique.
	 */
	onPointerDown(event) {
		event.preventDefault(); // Previne o comportamento padrão do navegador.

		// Obtém os shapes atualmente selecionados.
		this.selectedShapes = this.shapeController.getSelectShape();

		if (this.selectedShapes.length > 0) {
			// Captura a posição inicial do ponteiro.
			this.initialPointerPosition = this.getPointerPosition(event);
			this.firstPosition = this.getPointerPosition(event);

			// Adiciona os eventos para arrastar os shapes.
			this.drawScreen.addEventListener("pointermove", this.onPointerMove);
			this.drawScreen.addEventListener("pointerup", this.onPointerUp);
			this.drawScreen.addEventListener("pointercancel", this.onPointerUp); // Caso o toque seja cancelado em dispositivos móveis.
		}
	}

	/**
	 * Manipulador de eventos para finalizar o movimento dos shapes.
	 * Remove os eventos de movimento e armazena o comando para desfazer/refazer.
	 *
	 * @param {PointerEvent} event - O evento de término do movimento (soltar o mouse ou dedo).
	 */
	onPointerUp(event) {
		event.preventDefault(); // Previne o comportamento padrão do navegador.

		// Remove os eventos de movimentação.
		this.drawScreen.removeEventListener("pointermove", this.onPointerMove);
		this.drawScreen.removeEventListener("pointerup", this.onPointerUp);
		this.drawScreen.removeEventListener("pointercancel", this.onPointerUp);

		const lastPosition = this.getPointerPosition(event);

		// Se houve movimentação, cria um comando para armazenar no stack de Undo.
		if (
			this.firstPosition[0] !== lastPosition[0] ||
			this.firstPosition[1] !== lastPosition[1]
		) {
			const command = new MoveShapeCommand(
				this.shapeController.moveShapeManager,
				this.selectedShapes,
				this.firstPosition,
				lastPosition
			);

			this.shapeController.commandManager.undoStack.push(command);
		}

		// Atualiza o estado dos botões de Undo e Redo.
		this.updateUndoRedoButtons();
	}

	/**
	 * Função utilitária para obter a posição do ponteiro (suporta mouse e touch).
	 *
	 * @param {PointerEvent} event - O evento de ponteiro contendo as coordenadas.
	 * @returns {Array<number>} Um array contendo as coordenadas [x, y] do ponteiro ajustadas à grade.
	 */
	getPointerPosition(event) {
		return getMousePosition(this.drawScreen, this.gridSize, event);
	}
}
