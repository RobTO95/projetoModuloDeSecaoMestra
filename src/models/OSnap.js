/**
 * Classe Snap
 * Responsável por gerenciar a funcionalidade de snapping (alinhamento) em um container SVG.
 */
export default class Snap {
	/**
	 * Construtor da classe Snap.
	 * @param {HTMLElement} svgContainer - O container SVG onde a funcionalidade de snapping será aplicada.
	 */
	constructor(svgContainer) {
		this.snapPoints = []; // Array que armazena os pontos de snapping detectados.
		this.snapRadius = 10; // Raio máximo para detectar o snapping.
		this.activeSnapTypes = {
			endPoint: true, // Ativa snapping nos pontos finais do caminho (`endPoint`).
			midPoint: true, // (Futuro) Ativa snapping nos pontos médios do caminho.
			center: true, // (Futuro) Ativa snapping no centro do elemento.
			centroid: true, // (Futuro) Ativa snapping no centróide do elemento.
		};

		// Liga o método detectSnapPoints ao evento `pointermove` no container SVG.
		this.detectSnapPoints = this.detectSnapPoints.bind(this);
		svgContainer.parentElement.addEventListener(
			"pointermove",
			this.detectSnapPoints
		);
	}

	/**
	 * Limpa todos os pontos de snapping armazenados.
	 */
	clearSnapPoints() {
		this.snapPoints.length = 0; // Esvazia o array de pontos de snapping.
	}

	/**
	 * Detecta os pontos de snapping no elemento alvo do evento.
	 * @param {PointerEvent} event - O evento de movimento do ponteiro (`pointermove`).
	 */
	detectSnapPoints(event) {
		const element = event.target;
		// Apenas processa elementos do tipo `<path>`.
		if (element.tagName !== "path") {
			return;
		}

		// Limpa os pontos de snapping antes de detectar novos.
		this.clearSnapPoints();

		// Detecta pontos finais (`endPoint`) se esse tipo de snapping estiver ativo.
		if (this.activeSnapTypes.endPoint) {
			const endPointStrategy = new EndPointStrategy();
			const endPoints = endPointStrategy.detectSnapPoints(element);
			// Adiciona os pontos detectados ao array de snapping.
			this.snapPoints.push(...endPoints);
		}
		// Detecta pontos de centroide ('centroid') se esse tipo de snapping estiver ativo.
		if (this.activeSnapTypes.centroid) {
			const centroidStrategy = new CentroidStrategy();
			const centroidPoints = centroidStrategy.detectSnapPoints(element);

			// Adiciona os pontos detectados ao array de snapping.
			this.snapPoints.push(...centroidPoints);
		}
	}

	/**
	 * Encontra o ponto de snapping mais próximo da posição atual do cursor.
	 * @param {Object} cursorPosition - A posição atual do cursor, contendo `x` e `y`.
	 * @returns {Object|null} O ponto de snapping mais próximo ou `null` se nenhum for encontrado.
	 */
	findClosestSnapPoint(cursorPosition) {
		let closestSnapPoint = null; // Inicializa como nulo.
		let distanceMin = this.snapRadius; // Define a distância mínima inicial como o raio de snapping.

		// Itera sobre os pontos de snapping detectados.
		for (const snapPoint of this.snapPoints) {
			// Calcula a distância entre o cursor e o ponto de snapping.
			const distance = this.calculateDistance(cursorPosition, snapPoint.point);

			// Atualiza o ponto mais próximo se a distância for menor que o mínimo.
			if (distance <= this.snapRadius && distance < distanceMin) {
				closestSnapPoint = snapPoint;
				distanceMin = distance;
			}
		}
		return closestSnapPoint;
	}

	/**
	 * Calcula a distância entre dois pontos.
	 * @param {Object} point1 - Primeiro ponto com propriedades `x` e `y`.
	 * @param {Object} point2 - Segundo ponto com propriedades `x` e `y`.
	 * @returns {number} A distância euclidiana entre os dois pontos.
	 */
	calculateDistance(point1, point2) {
		return Math.sqrt(
			Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
		);
	}

	/**
	 * Define os tipos de snapping ativos.
	 * @param {Object} types - Objeto com os tipos de snapping a serem ativados/desativados.
	 *                         Exemplo: { endPoint: false, center: true }
	 */
	setActiveSnapTypes(types) {
		this.activeSnapTypes = { ...this.activeSnapTypes, ...types };
	}

	/**
	 * Realiza o snapping para o ponto mais próximo, se existir.
	 * @param {Object} cursorPosition - A posição atual do cursor, contendo `x` e `y`.
	 * @returns {Object|null} O ponto de snapping mais próximo ou `null` se nenhum for encontrado.
	 */
	snapTo(cursorPosition) {
		const closestSnapPoint = this.findClosestSnapPoint(cursorPosition);

		if (closestSnapPoint) {
			return closestSnapPoint; // Retorna o ponto de snapping mais próximo.
		}
		return null; // Retorna `null` se nenhum ponto estiver no raio de snapping.
	}
}

//----------------------------------------------------------------------------------------------------
/**
 * Classe base para estratégias de detecção de pontos de snap (encaixe) em elementos SVG.
 * Esta classe deve ser estendida para implementar diferentes estratégias de detecção.
 */
class SnapPointsStrategy {
	/**
	 * Método abstrato para detectar pontos de snap em um elemento.
	 * Deve ser implementado pelas subclasses.
	 * @param {HTMLElement} element - O elemento SVG a ser analisado.
	 * @throws {Error} Lança erro caso não seja implementado.
	 */
	detectSnapPoints(element) {
		throw new Error("Implemente o método detectSnapPoints!");
	}

	/**
	 * Aplica transformações (translate, scale, rotate) a um ponto.
	 * Este método considera as transformações aplicadas ao elemento SVG e ajusta o ponto de acordo.
	 * @param {Object} point - Ponto original com propriedades `x` e `y`.
	 * @param {string} transform - String representando as transformações aplicadas ao elemento.
	 * @returns {Object} Ponto transformado com propriedades `x` e `y`.
	 */
	applyTransformations(point, transform) {
		if (!transform) return point;

		let { x, y } = point;

		// Aplica a transformação `scale`
		const scaleMatch = transform.match(
			/scale\(\s*([-?\d.]+)\s*(?:,\s*([-?\d.]+))?\s*\)/
		);
		if (scaleMatch) {
			const [, sx, sy = sx] = scaleMatch; // Assume `sy = sx` se não fornecido
			x *= parseFloat(sx);
			y *= parseFloat(sy);
		}

		// Aplica a transformação `rotate`
		const rotateMatch = transform.match(
			/rotate\(\s*([-?\d.]+)\s*(?:,\s*([-?\d.]+),\s*([-?\d.]+))?\s*\)/
		);
		if (rotateMatch) {
			const [, angle, cx = 0, cy = 0] = rotateMatch;
			({ x, y } = this.applyRotation(
				{ x, y },
				parseFloat(angle),
				parseFloat(cx),
				parseFloat(cy)
			));
		}

		// Aplica a transformação `translate`
		const translateMatch = transform.match(
			/translate\(\s*([-?\d.]+)\s*,\s*([-?\d.]+)\s*\)/
		);
		if (translateMatch) {
			const [, tx, ty] = translateMatch;
			x += parseFloat(tx);
			y += parseFloat(ty);
		}

		return { x, y };
	}

	/**
	 * Aplica uma rotação a um ponto em torno de um centro definido.
	 * Este método calcula a nova posição do ponto após a rotação no plano cartesiano.
	 * @param {Object} point - Ponto original com propriedades `x` e `y`.
	 * @param {number} angle - Ângulo de rotação em graus.
	 * @param {number} cx - Coordenada `x` do centro de rotação (padrão: 0).
	 * @param {number} cy - Coordenada `y` do centro de rotação (padrão: 0).
	 * @returns {Object} Ponto rotacionado com propriedades `x` e `y`.
	 */
	applyRotation(point, angle, cx = 0, cy = 0) {
		const angleInRadians = (angle * Math.PI) / 180; // Converte o ângulo para radianos
		const offsetX = point.x - cx; // Deslocamento em relação ao centro
		const offsetY = point.y - cy;

		// Calcula as novas coordenadas após a rotação
		const rotatedX =
			offsetX * Math.cos(angleInRadians) -
			offsetY * Math.sin(angleInRadians) +
			cx;
		const rotatedY =
			offsetX * Math.sin(angleInRadians) +
			offsetY * Math.cos(angleInRadians) +
			cy;

		return { x: rotatedX, y: rotatedY };
	}
}

//------------------------------------------------------------------------------------------------------------------------------------

/**
 * Classe EndPointStrategy
 * Extende a classe SnapPointsStrategy para detectar pontos finais (endPoint)
 * em elementos SVG do tipo <path>, considerando suas transformações (translate, scale, rotate).
 */
class EndPointStrategy extends SnapPointsStrategy {
	/**
	 * Detecta pontos de snap (encaixe) nos elementos SVG.
	 * Identifica os pontos finais de um caminho (path) e aplica as transformações definidas no atributo transform.
	 * @param {Element} element - Elemento SVG a ser analisado.
	 * @returns {Array} Array de objetos representando os pontos finais detectados.
	 */
	detectSnapPoints(element) {
		if (element.tagName === "path") {
			let points = [];
			const d = element.getAttribute("d"); // Caminho definido no atributo d
			const transform = element.getAttribute("transform"); // Transformações aplicadas ao elemento

			if (d) {
				// Extrai os comandos de movimentação e linha do caminho
				const commands = this.extractPathCommands(d);
				if (commands) {
					commands.forEach((command) => {
						// Analisa cada comando e extrai as coordenadas
						const { x, y } = this.parseCommand(command);

						// Aplica as transformações às coordenadas extraídas
						const { x: transformedX, y: transformedY } =
							this.applyTransformations(
								{ x: parseFloat(x), y: parseFloat(y) },
								transform
							);

						// Adiciona o ponto transformado ao array de pontos finais
						points.push({
							type: "endPoint",
							point: { x: transformedX, y: transformedY },
						});
					});
				}
			}
			return points;
		}
	}

	/**
	 * Extrai os comandos de movimentação (M) e linha (L) de um caminho SVG.
	 * @param {string} d - O atributo d de um elemento <path>.
	 * @returns {Array<string>} Array de comandos encontrados.
	 */
	extractPathCommands(d) {
		return d.match(/[ML]\s*([-?\d.]+),\s*([-?\d.]+)/g);
	}

	/**
	 * Analisa um comando de caminho e retorna suas coordenadas.
	 * @param {string} command - Comando M ou L com coordenadas.
	 * @returns {Object} Objeto contendo as coordenadas x e y.
	 */
	parseCommand(command) {
		const [, x, y] = command.match(/[ML]\s*([-?\d.]+),\s*([-?\d.]+)/);
		return { x, y };
	}
}

// ---------------------------------------------------------------------------------

/**
 * Classe CentroidStrategy
 * Extende a classe SnapPointsStrategy para detectar o centroide (ponto médio de uma forma)
 * em elementos SVG do tipo `<path>`, considerando suas transformações (translate, scale, rotate).
 */
class CentroidStrategy extends SnapPointsStrategy {
	/**
	 * Detecta pontos de snap (encaixe) nos elementos SVG.
	 * Identifica o centroide de um caminho (`path`) considerando suas transformações aplicadas.
	 * @param {Element} element - Elemento SVG a ser analisado.
	 * @returns {Array} Array de objetos representando o centroide detectado.
	 * Cada objeto contém:
	 *   - `type`: Tipo de ponto de snap, neste caso, "centroid".
	 *   - `point`: Objeto com as coordenadas `x` e `y` do centroide transformado.
	 */
	detectSnapPoints(element) {
		if (element.tagName === "path") {
			let points = [];
			const d = element.getAttribute("d"); // Caminho definido no atributo `d`
			const transform = element.getAttribute("transform"); // Transformações aplicadas ao elemento

			if (d) {
				// Converte o caminho SVG em pontos discretos
				const pointsArray = this.extractPathPoints(d, element);
				if (pointsArray && pointsArray.length > 0) {
					// Calcula o centroide do caminho
					const centroid = this.calculateCentroid(pointsArray);

					// Aplica as transformações ao centroide
					const { x: transformedX, y: transformedY } =
						this.applyTransformations(centroid, transform);

					points.push({
						type: "centroid",
						point: { x: transformedX, y: transformedY },
					});
				}
			}
			return points;
		}
	}

	/**
	 * Extrai os pontos discretos de um caminho SVG.
	 * Este método calcula uma lista de pontos ao longo do caminho SVG utilizando o comprimento total do caminho.
	 * @param {string} d - O atributo `d` de um elemento `<path>`.
	 * @param {Element} element - O elemento `<path>` do qual os pontos serão extraídos.
	 * @returns {Array} Array de pontos ao longo do caminho, cada ponto é representado como um array `[x, y]`.
	 */
	extractPathPoints(d, element) {
		// Gera uma lista de pontos discretos ao longo do caminho
		const path = element;
		const points = [];
		const length = path.getTotalLength(); // Obtém o comprimento total do caminho
		const resolution = 0.01; // Definindo uma resolução para capturar pontos discretos ao longo do caminho
		for (let i = 0; i <= length; i += resolution) {
			const point = path.getPointAtLength(i); // Obtém as coordenadas de um ponto ao longo do caminho
			points.push([point.x, point.y]);
		}
		return points;
	}

	/**
	 * Calcula o centroide de uma lista de pontos.
	 * O centroide é o ponto médio, calculado como a média das coordenadas x e y de todos os pontos.
	 * @param {Array} points - Lista de pontos representando o caminho.
	 * @returns {Object} O centroide calculado com as propriedades `x` e `y`.
	 * Retorna `{x: 0, y: 0}` se não houver pontos disponíveis.
	 */
	calculateCentroid(points) {
		if (points.length === 0) {
			console.warn("Nenhum ponto disponível para calcular o centroide.");
			return { x: 0, y: 0 };
		}

		// Calcula a média das coordenadas x e y
		let sumX = 0;
		let sumY = 0;
		points.forEach((point) => {
			sumX += point[0];
			sumY += point[1];
		});

		const centroidX = sumX / points.length;
		const centroidY = sumY / points.length;
		return { x: centroidX, y: centroidY };
	}
}
