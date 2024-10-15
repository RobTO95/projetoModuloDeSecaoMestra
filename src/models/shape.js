import * as d3 from "d3";

/**
 * Classe Shape
 *
 * Representa um shape SVG parametrizado com dados, permitindo transformações como rotação, escala e movimentação.
 * Utiliza D3.js para manipulação de SVGs e geração de caminhos baseados em dados.
 */
export class Shape {
	#data;
	#position;
	#angle;
	#scale;
	#lineGenerator;
	#strokeColor;
	#strokeWidth;
	#fill;
	#id;
	#path;

	/**
	 * @constructor
	 * @param {SVGElement} objectDraw - Elemento SVG onde o shape será desenhado.
	 * @param {Array} [data=null] - Dados que descrevem os pontos do shape.
	 * @param {Array<number>} [position=[0, 0]] - Posição inicial do shape no SVG.
	 * @param {number} [angle=0] - Ângulo de rotação inicial do shape (em graus).
	 * @param {Array<number>} [scale=[1, 1]] - Escala inicial do shape no eixo X e Y.
	 */
	constructor(
		objectDraw,
		data = null,
		position = null,
		angle = null,
		scale = null
	) {
		this.objectDraw = d3.select(objectDraw);
		this.#data = data || []; // Armazena os dados internamente.
		this.#position = position || [0, 0]; // Armazena a posição internamente.
		this.#angle = angle || 0; // Armazena o ângulo de rotação internamente.
		this.#scale = scale || [1, 1]; // Define a escala com valor padrão [1, 1].
		this.#strokeColor = "";
		this.#strokeWidth = 1;
		this.#fill = "steelblue";
		this.#path = null;

		// Gera a linha a partir dos dados.
		this.#lineGenerator = d3.line();

		// Desenha o shape inicial.
		this.updatePath();
	}

	/**
	 * Atualiza o caminho do shape no SVG, aplicando as transformações de posição, rotação e escala.
	 */
	updatePath() {
		if (!this.#path) {
			// Cria o caminho inicial se ainda não existir.
			this.#path = this.objectDraw.append("path");
		}

		// Cria a string do caminho baseado nos pontos de dados.
		const pathString = this.#lineGenerator(this.#data);

		// Atualiza o atributo "d" do caminho e aplica as transformações.
		this.#path
			.attr("d", pathString)
			.attr(
				"transform",
				`translate(${this.#position[0]}, ${this.#position[1]}) rotate(${
					this.#angle
				}) scale(${this.#scale[0]}, ${this.#scale[1]})`
			)
			.attr("stroke", this.#strokeColor)
			.attr("fill", this.#fill)
			.attr("stroke-width", this.#strokeWidth)
			.attr("id", `shape-${this.#id}`);
	}

	/**
	 * Remove o caminho (path) do shape do SVG.
	 */
	removePath() {
		if (this.#path) {
			this.objectDraw.node().removeChild(this.#path.node());
			this.#path = null;
		}
	}

	/**
	 * @type {SVGPathElement} - Retorna o elemento path do shape no SVG.
	 */
	get path() {
		return this.#path;
	}

	/**
	 * @type {Function} - Retorna o gerador de linha do D3.js utilizado para criar o caminho do shape.
	 */
	get lineGenerator() {
		return this.#lineGenerator;
	}

	/**
	 * Define a cor de preenchimento do shape.
	 * @param {string} color - Cor de preenchimento (ex: 'red', '#000000').
	 */
	set fill(color) {
		this.#fill = color;
		this.updatePath();
	}

	/**
	 * @type {string} - Retorna a cor de preenchimento do shape.
	 */
	get fill() {
		return this.#fill;
	}

	/**
	 * Define a espessura da borda do shape.
	 * @param {number} width - Espessura da borda.
	 */
	set strokeWidth(width) {
		this.#strokeWidth = width;
		this.updatePath();
	}

	/**
	 * @type {number} - Retorna a espessura da borda do shape.
	 */
	get strokeWidth() {
		return this.#strokeWidth;
	}

	/**
	 * Define a cor da borda do shape.
	 * @param {string} color - Cor da borda (ex: 'blue', '#ff0000').
	 */
	set strokeColor(color) {
		this.#strokeColor = color;
		this.updatePath();
	}

	/**
	 * @type {string} - Retorna a cor da borda do shape.
	 */
	get strokeColor() {
		return this.#strokeColor;
	}

	/**
	 * Define os dados (pontos) do shape.
	 * @param {Array} newData - Um array de pontos representando o shape.
	 */
	set data(newData) {
		this.#data = newData;
		this.updatePath();
	}

	/**
	 * @type {Array} - Retorna os dados atuais do shape.
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Define a posição do shape no SVG.
	 * @param {Array<number>} newPosition - Array [x, y] representando a nova posição do shape.
	 */
	set position(newPosition) {
		this.#position = newPosition;
		this.updatePath();
	}

	/**
	 * @type {Array<number>} - Retorna a posição atual do shape.
	 */
	get position() {
		return this.#position;
	}

	/**
	 * Define o ângulo de rotação do shape.
	 * @param {number} newAngle - Novo ângulo de rotação (em graus).
	 */
	set angle(newAngle) {
		this.#angle = newAngle;
		this.updatePath();
	}

	/**
	 * @type {number} - Retorna o ângulo de rotação atual do shape.
	 */
	get angle() {
		return this.#angle;
	}

	/**
	 * Define a escala do shape.
	 * @param {Array<number>} newScale - Array [escalaX, escalaY] representando a nova escala do shape.
	 */
	set scale(newScale) {
		this.#scale = newScale;
		this.updatePath();
	}

	/**
	 * @type {Array<number>} - Retorna a escala atual do shape.
	 */
	get scale() {
		return this.#scale;
	}

	/**
	 * Define o ID do shape.
	 * @param {string} value - O ID único para o shape.
	 */
	set id(value) {
		this.#id = value;
		this.updatePath();
	}

	/**
	 * @type {string} - Retorna o ID do shape.
	 */
	get id() {
		return this.#id;
	}
}
