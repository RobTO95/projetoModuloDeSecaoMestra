import * as d3 from "d3";

/**
 * Obtém a escala de um elemento SVG.
 * @param {HTMLElement} svgElement - O elemento SVG ou grupo (<g>) a ser analisado.
 * @returns {{ scaleX: number, scaleY: number }} - A escala nos eixos X e Y.
 */
export function getScaleSVG(svgElement) {
	// Seleciona o elemento usando D3
	const selection = d3.select(svgElement);

	// Obtém o atributo "transform" como string
	const transform = selection.attr("transform");

	// Verifica se há transformação definida
	if (!transform) {
		return { scaleX: 1, scaleY: 1 }; // Retorna a escala padrão
	}

	// Expressão regular para capturar a escala
	const scaleMatch = transform.match(/scale\(([^,]+),?([^)]+)?\)/);

	if (scaleMatch) {
		const scaleX = parseFloat(scaleMatch[1]); // Escala no eixo X
		const scaleY = scaleMatch[2] ? parseFloat(scaleMatch[2]) : scaleX; // Escala no eixo Y ou usa X
		return { scaleX, scaleY };
	}

	// Retorna escala padrão se nenhuma escala for encontrada
	return { scaleX: 1, scaleY: 1 };
}

export function getDrawScreenDimensions(svgElement) {
	const bbox = svgElement.getBoundingClientRect();
	const width = bbox.width;
	const height = bbox.height;
	return { width, height };
}

export function getMousePosition(svgElement, gridSize = 10, event = null) {
	let position = d3.pointer(event, svgElement);

	// console.log(position);
	position[0] = position[0] - getDrawScreenDimensions(svgElement).width / 2;
	position[1] = getDrawScreenDimensions(svgElement).height / 2 - position[1];
	position = position.map(
		(value) => Number((value / gridSize).toFixed(0)) * gridSize
	);
	return [position[0], position[1]];
}

/**
 * Calcula a posição ajustada do cursor com base nos pontos de *snap* (ajuste de precisão) mais próximos.
 * Essa função obtém a posição atual do mouse, identifica o shape onde o cursor está localizado,
 * e verifica se existe algum ponto de *snap* ativo próximo. Se houver, ajusta a posição do mouse para esse ponto de *snap*.
 *
 * @param {HTMLElement} svgContainer - O contêiner SVG onde os shapes estão desenhados e onde ocorre o evento de cursor.
 * @param {MouseEvent} event - O evento de mouse (ou toque em dispositivos móveis) que fornece a posição atual do cursor.
 * @param {Array} shapeList - Lista de objetos de shapes disponíveis na tela, onde cada shape possui uma referência ao elemento SVG correspondente e suas propriedades geométricas.
 * @param {Snap} snapInstance - Uma instância da classe Snap, que possui métodos para detectar pontos de *snap* nos shapes e para calcular ajustes de *snap* na posição do cursor.
 *
 * @returns {Object} - Um objeto representando a posição ajustada do cursor. A posição final é no ponto de *snap* mais próximo se estiver dentro do raio de ajuste, ou na posição original do mouse.
 * @property {number} x - A posição ajustada do cursor no eixo X.
 * @property {number} y - A posição ajustada do cursor no eixo Y.
 *
 * @example
 * // Supondo que snapInstance já foi inicializado com os tipos de snap desejados.
 * const snapPosition = getMouseSnapPosition(svgContainer, event, shapeList, snapInstance);
 * console.log(`Posição ajustada do mouse: X=${snapPosition.x}, Y=${snapPosition.y}`);
 */
export function getMouseSnapPosition(
	svgContainer,
	event,
	shapeList,
	snapInstance
) {
	let positionMouse = {
		x: d3.pointer(event, svgContainer)[0],
		y: d3.pointer(event, svgContainer)[1],
	};

	// Localiza o shape onde o cursor está atualmente posicionado
	const objectShape = shapeList.find((shape) => shape.shape === event.target);
	// Detecta os pontos de snap no shape atual
	snapInstance.detectSnapPoints(objectShape);

	// Verifica se existe um ponto de snap próximo e ajusta a posição do cursor
	let snapPosition = snapInstance.snapTo(positionMouse);
	if (snapPosition) {
		positionMouse = snapPosition;
	}

	return positionMouse;
}
