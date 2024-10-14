import * as d3 from "d3";

/**
 * Classe CustomShape para criar e manipular formas personalizadas em um SVG.
 * Esta classe permite a criação de formas com caminhos customizados, como linhas, arcos e curvas Bézier.
 * Ela também suporta manipulações como translações, rotações e escalonamento.
 */
export default class CustomShape {
	#data; // Armazena os comandos de desenho da forma
	#drawScreen; // Elemento onde a forma será desenhada
	#fill; // Cor de preenchimento da forma
	#stroke; // Cor da borda da forma
	#strokeWidth; // Espessura da borda da forma
	#path; // Caminho da forma (path)
	#shape; // Elemento SVG correspondente à forma
	#position; // Posição da forma no SVG
	#angle; // Ângulo de rotação da forma
	#scale; // Escala da forma
	#id; // Identificador único da forma

	/**
	 * Construtor da classe CustomShape.
	 * Inicializa a forma com valores padrão de posição, escala, cores e caminho.
	 *
	 * @param {HTMLElement} drawScreen - O elemento SVG onde a forma será desenhada.
	 */
	constructor(drawScreen) {
		this.#drawScreen = drawScreen;
		this.#path = d3.path(); // Cria um novo caminho SVG
		this.#data = []; // Armazena os comandos de desenho
		this.#shape = null; // O elemento SVG será criado ao adicionar a forma
		this.#stroke = "red"; // Cor da borda padrão
		this.#strokeWidth = 1; // Espessura padrão da borda
		this.#fill = "steelblue"; // Cor de preenchimento padrão
		this.#position = [0, 0]; // Posição inicial da forma
		this.#angle = 0; // Ângulo de rotação inicial
		this.#scale = [1, 1]; // Escala padrão
		this.#id = null; // Identificador único da forma
		this.updatePath(); // Atualiza o caminho inicial
	}

	// Getters e setters para manipular as propriedades da forma

	/**
	 * Obtém o elemento SVG onde a forma será desenhada.
	 * @returns {HTMLElement} - O elemento SVG do desenho.
	 */
	get drawScreen() {
		return this.#drawScreen;
	}

	/**
	 * Define o elemento SVG onde a forma será desenhada.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {HTMLElement} newScreen - O novo elemento SVG de desenho.
	 */
	set drawScreen(newScreen) {
		this.#drawScreen = newScreen;
		this.updatePath();
	}

	/**
	 * Obtém o nó SVG correspondente à forma.
	 * @returns {SVGElement|null} - O elemento SVG da forma ou null se não existir.
	 */
	get shape() {
		return this.#shape ? this.#shape.node() : null;
	}

	/**
	 * Obtém os dados de comandos de desenho da forma.
	 * @returns {Array} - Um array de comandos que definem o caminho da forma.
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Define novos dados de comandos para a forma.
	 * Atualiza o caminho da forma se os dados forem alterados.
	 *
	 * @param {Array} newData - O novo array de comandos para o caminho.
	 */
	set data(newData) {
		if (newData !== this.#data) {
			this.#data = newData;
			this.updatePath();
		}
	}

	/**
	 * Obtém a cor de preenchimento da forma.
	 * @returns {string} - A cor de preenchimento.
	 */
	get fill() {
		return this.#fill;
	}

	/**
	 * Define a cor de preenchimento da forma.
	 * Atualiza o preenchimento no elemento SVG se necessário.
	 *
	 * @param {string} color - A nova cor de preenchimento.
	 */
	set fill(color) {
		if (color !== this.#fill) {
			this.#fill = color;
			if (this.#shape) {
				this.#shape.attr("fill", this.isClosed() ? this.#fill : "none");
			}
		}
	}

	/**
	 * Obtém a cor da borda da forma.
	 * @returns {string} - A cor da borda.
	 */
	get stroke() {
		return this.#stroke;
	}

	/**
	 * Define a cor da borda da forma.
	 * Atualiza o elemento SVG se necessário.
	 *
	 * @param {string} color - A nova cor da borda.
	 */
	set stroke(color) {
		if (color !== this.#stroke) {
			this.#stroke = color;
			if (this.#shape) {
				this.#shape.attr("stroke", this.#stroke);
			}
		}
	}

	/**
	 * Obtém a espessura da borda da forma.
	 * @returns {number} - A espessura da borda.
	 */
	get strokeWidth() {
		return this.#strokeWidth;
	}

	/**
	 * Define a espessura da borda da forma.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {number} width - A nova espessura da borda.
	 */
	set strokeWidth(width) {
		this.#strokeWidth = width;
		this.updatePath();
	}

	/**
	 * Obtém a posição da forma no SVG.
	 * @returns {Array} - Um array [x, y] representando a posição da forma.
	 */
	get position() {
		return this.#position;
	}

	/**
	 * Define uma nova posição para a forma.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {Array} newPosition - Um array [x, y] com a nova posição.
	 */
	set position(newPosition) {
		this.#position = newPosition;
		this.updatePath();
	}

	/**
	 * Obtém o ângulo de rotação da forma.
	 * @returns {number} - O ângulo de rotação em graus.
	 */
	get angle() {
		return this.#angle;
	}

	/**
	 * Define um novo ângulo de rotação para a forma.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {number} newAngle - O novo ângulo de rotação em graus.
	 */
	set angle(newAngle) {
		this.#angle = newAngle;
		this.updatePath();
	}

	/**
	 * Obtém a escala da forma.
	 * @returns {Array} - Um array [sx, sy] representando a escala em x e y.
	 */
	get scale() {
		return this.#scale;
	}

	/**
	 * Define uma nova escala para a forma.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {Array} newScale - Um array [sx, sy] com a nova escala.
	 */
	set scale(newScale) {
		this.#scale = newScale;
		this.updatePath();
	}

	/**
	 * Obtém o identificador único da forma.
	 * @returns {string} - O identificador da forma.
	 */
	get id() {
		return this.#id;
	}

	/**
	 * Define um novo identificador único para a forma.
	 * Atualiza o caminho da forma após a mudança.
	 *
	 * @param {string} newId - O novo identificador.
	 */
	set id(newId) {
		this.#id = newId;
		this.updatePath();
	}

	// Métodos de manipulação do caminho

	/**
	 * Verifica se o caminho da forma está fechado.
	 * @returns {boolean} - Retorna true se o caminho estiver fechado, false caso contrário.
	 */
	isClosed() {
		const pathString = this.#path.toString();
		return pathString[pathString.length - 1] === "Z";
	}

	/**
	 * Atualiza o caminho da forma no SVG com base nas propriedades atuais.
	 * Aplica atributos como posição, rotação, escala, cor de preenchimento e borda.
	 */
	updatePath() {
		if (!this.#shape) {
			this.#shape = d3.select(this.drawScreen).append("path");
		}
		this.#shape
			.attr("d", this.#path.toString())
			.attr("fill", this.isClosed() ? this.#fill : "none")
			.attr("stroke", this.isClosed() ? "none" : this.#stroke)
			.attr("stroke-width", this.#strokeWidth)
			.attr(
				"transform",
				`translate(${this.#position[0]}, ${this.#position[1]}) rotate(${
					this.#angle
				}) scale(${this.#scale[0]}, ${this.#scale[1]})`
			)
			.attr("id", `shape-${this.#id}`);
	}

	/**
	 * Regenera o caminho da forma com base nos dados atuais.
	 * Recria o caminho de acordo com os comandos armazenados em #data.
	 */
	regeneratePath() {
		this.#path = d3.path(); // Reseta o caminho
		this.#data.forEach((command) => {
			switch (command.type) {
				case "moveTo":
					this.#path.moveTo(command.x, command.y);
					break;
				case "lineTo":
					this.#path.lineTo(command.x, command.y);
					break;
				case "arc":
					this.#path.arc(
						command.x,
						command.y,
						command.radius,
						command.startAngle,
						command.endAngle
					);
					break;
				case "arcTo":
					this.#path.arcTo(
						command.x1,
						command.y1,
						command.x2,
						command.y2,
						command.radius
					);
				case "bezierCurveTo":
					this.#path.bezierCurveTo(
						command.cp1x,
						command.cp1y,
						command.cp2x,
						command.cp2y,
						command.x,
						command.y
					);
					break;
				case "closePath":
					this.#path.closePath();
					break;
			}
		});
		this.updatePath(); // Atualiza o caminho no SVG
	}

	/**
	 * Adiciona um ponto âncora ao caminho.
	 * @param {number} x - Coordenada x do ponto.
	 * @param {number} y - Coordenada y do ponto.
	 */
	anchor(x, y) {
		this.#path.moveTo(x, y);
		this.#data.push({ type: "moveTo", x: x, y: y });
		this.updatePath();
	}

	/**
	 * Adiciona uma linha ao caminho.
	 * @param {number} x - Coordenada x do ponto final.
	 * @param {number} y - Coordenada y do ponto final.
	 */
	line(x, y) {
		this.#path.lineTo(x, y);
		this.#data.push({ type: "lineTo", x: x, y: y });
		this.updatePath();
	}

	/**
	 * Adiciona um arco ao caminho.
	 * @param {number} x - Coordenada x do centro do arco.
	 * @param {number} y - Coordenada y do centro do arco.
	 * @param {number} radius - Raio do arco.
	 * @param {number} startAngle - Ângulo inicial do arco.
	 * @param {number} endAngle - Ângulo final do arco.
	 * @param {boolean} orientation - Sentido de criação do arco.
	 */
	arc(x, y, radius, startAngle, endAngle, anticlockwise) {
		this.#path.arc(
			x,
			y,
			radius,
			(Math.PI / 180) * startAngle,
			(Math.PI / 180) * endAngle,
			anticlockwise
		);
		this.#data.push({
			type: "arc",
			x,
			y,
			radius,
			startAngle,
			endAngle,
			anticlockwise,
		});
		this.updatePath();
	}

	/**
	 *
	 * @param {number} x1 - Coordenada x do primeiro ponto tangente ao arco
	 * @param {number} y1 - Coordenada y do primeiro ponto tangente ao arco
	 * @param {number} x2 - Coordenada x do segundo ponto tangente ao arco
	 * @param {number} y2 - Coordenada y do segundo ponto tangente ao arco
	 * @param {number} radius - Raio do arco
	 */
	arcTo(x1, y1, x2, y2, radius) {
		this.#path.arcTo(x1, y1, x2, y2, radius);
		this.#data.push({
			type: "arcTo",
			x1,
			y1,
			x2,
			y2,
			radius,
		});
		this.updatePath();
	}

	/**
	 * Adiciona uma curva bezier ao caminho.
	 * @param {number} cp1x - Coordenada x do primeiro ponto de controle.
	 * @param {number} cp1y - Coordenada y do primeiro ponto de controle.
	 * @param {number} cp2x - Coordenada x do segundo ponto de controle.
	 * @param {number} cp2y - Coordenada y do segundo ponto de controle.
	 * @param {number} x - Coordenada x do ponto final.
	 * @param {number} y - Coordenada y do ponto final.
	 */
	bezierCurve(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.#path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		this.#data.push({
			type: "bezierCurveTo",
			cp1x,
			cp1y,
			cp2x,
			cp2y,
			x,
			y,
		});
		this.updatePath();
	}

	/**
	 * Fecha o caminho.
	 */
	close() {
		this.#path.closePath();
		this.#data.push({ type: "closePath" });
		this.updatePath();
	}

	/**
	 * Calcula a área do caminho atual.
	 * Apenas formas fechadas podem ter a área calculada.
	 * @returns {number} - A área da forma ou 0 se o caminho não estiver fechado.
	 */
	calculateArea() {
		if (!this.isClosed()) {
			console.warn(
				"O caminho não está fechado, a área não pode ser calculada."
			);
			return 0;
		}

		const points = this.#generatePointsPolygon();

		// Usamos o d3.polygonArea para calcular a área do polígono resultante
		/**
		 * -----------------------------
		 * Verifica o poligono
		 * -----------------------------
		 */

		// const lineGerator = d3.line();
		// const pathString = lineGerator(points);
		// const path = d3
		// 	.select(this.#drawScreen)
		// 	.append("path")
		// 	.attr("d", pathString)
		// 	.attr("fill", "none")
		// 	.attr("stroke", "red");
		/**
		 * -------------------------------
		 * fim da verificação do poligono
		 * -------------------------------
		 */

		const area = d3.polygonArea(points);
		return Math.abs(area); // A área pode ser negativa dependendo da ordem dos pontos, então tomamos o valor absoluto
	}

	calculateCentroid() {
		if (!this.isClosed()) {
			console.warn(
				"O caminho não está fechado, o centroid não pode ser calculado."
			);
			return 0;
		}
		const points = this.#generatePointsPolygon();
		const centroid = d3.polygonCentroid(points);
		return centroid;
	}

	/**
	 * Gera pontos discretos ao longo do path para aproximar sua forma.
	 * @returns {Array} - Um array de pontos ao longo do path
	 */
	#generatePointsPolygon() {
		const points = [];
		this.#data.forEach((command) => {
			switch (command.type) {
				case "moveTo":
					points.push([command.x, command.y]);
					break;
				case "lineTo":
					points.push([command.x, command.y]);
					break;
				case "arc":
					// Dividimos o arco em pequenos segmentos para aproximar a área
					const arcPoints = this.#getArcPoints(
						command.x,
						command.y,
						command.radius,
						command.startAngle,
						command.endAngle,
						command.anticlockwise
					);
					points.push(...arcPoints);
					break;
				case "bezierCurveTo":
					// Dividimos a curva Bézier em segmentos
					const bezierPoints = this.#getBezierCurvePoints(
						points[points.length - 1], // Último ponto como início
						[command.cp1x, command.cp1y],
						[command.cp2x, command.cp2y],
						[command.x, command.y]
					);
					points.push(...bezierPoints);
					break;
				// Não há necessidade de manipular closePath
			}
		});
		return points;
	}

	/**
	 * Gera pontos discretos ao longo de um arco para aproximar sua forma.
	 * @param {number} cx - Coordenada x do centro do arco.
	 * @param {number} cy - Coordenada y do centro do arco.
	 * @param {number} radius - Raio do arco.
	 * @param {number} startAngle - Ângulo inicial do arco (em graus).
	 * @param {number} endAngle - Ângulo final do arco (em graus).
	 * @param {boolean} anticlockwise - Direção do arco.
	 * @returns {Array} - Um array de pontos ao longo do arco.
	 */
	#getArcPoints(cx, cy, radius, startAngle, endAngle, anticlockwise) {
		const points = [];
		const step = 1; // Define a resolução do arco (quanto menor, mais preciso)
		const angleDirection = anticlockwise ? -1 : 1;

		// Normalizar ângulos para o intervalo 0 a 360 graus
		startAngle = startAngle % 360;
		endAngle = endAngle % 360;

		// Lidar com a lógica para casos onde startAngle > endAngle
		if (anticlockwise && startAngle < endAngle) {
			// Se anti-horário e startAngle é menor, adiciona 360 ao final para completar o arco
			endAngle -= 360;
		} else if (!anticlockwise && startAngle > endAngle) {
			// Se horário e startAngle é maior, adiciona 360 ao final para completar o arco
			endAngle += 360;
		}

		// Direção do loop conforme anti-horário ou horário
		if (anticlockwise) {
			// Caso anti-horário, decremente o ângulo
			for (let angle = startAngle; angle >= endAngle; angle -= step) {
				const rad = (Math.PI / 180) * angle;
				const x = cx + radius * Math.cos(rad);
				const y = cy + radius * Math.sin(rad);
				points.push([x, y]);
			}
		} else {
			// Caso horário, incremente o ângulo
			for (let angle = startAngle; angle <= endAngle; angle += step) {
				const rad = (Math.PI / 180) * angle;
				const x = cx + radius * Math.cos(rad);
				const y = cy + radius * Math.sin(rad);
				points.push([x, y]);
			}
		}

		return points;
	}

	/**
	 * Gera pontos discretos ao longo de uma curva Bézier para aproximar sua forma.
	 * @param {Array} start - Ponto inicial da curva [x, y].
	 * @param {Array} cp1 - Primeiro ponto de controle [x, y].
	 * @param {Array} cp2 - Segundo ponto de controle [x, y].
	 * @param {Array} end - Ponto final da curva [x, y].
	 * @returns {Array} - Um array de pontos ao longo da curva.
	 */
	#getBezierCurvePoints(start, cp1, cp2, end) {
		const points = [];
		const tStep = 0.05; // Define a resolução da curva Bézier (quanto menor, mais preciso)
		for (let t = 0; t <= 1; t += tStep) {
			const x =
				Math.pow(1 - t, 3) * start[0] +
				3 * Math.pow(1 - t, 2) * t * cp1[0] +
				3 * (1 - t) * Math.pow(t, 2) * cp2[0] +
				Math.pow(t, 3) * end[0];
			const y =
				Math.pow(1 - t, 3) * start[1] +
				3 * Math.pow(1 - t, 2) * t * cp1[1] +
				3 * (1 - t) * Math.pow(t, 2) * cp2[1] +
				Math.pow(t, 3) * end[1];
			points.push([x, y]);
		}
		return points;
	}
}
