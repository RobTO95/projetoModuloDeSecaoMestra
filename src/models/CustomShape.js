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
}
