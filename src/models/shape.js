import * as d3 from "d3";

// Classe Shape
export class Shape {
	#data;
	#position;
	#angle;
	#scale;
	#strokeColor;
	#strokeWidth;
	#fill;
	#id;
	constructor(
		objectDraw,
		data = null,
		position = null,
		angle = null,
		scale = null
	) {
		this.objectDraw = d3.select(objectDraw);
		this.#data = data || []; // Armazena os dados internamente
		this.#position = position || [0, 0]; // Armazena a posição internamente
		this.#angle = angle || 0; // Armazena o ângulo de rotação internamente
		this.#scale = scale || [1, 1]; // Define a escala com valor padrão [1, 1]
		this.#strokeColor = "";
		this.#strokeWidth = 1;
		this.#fill = "steelblue";

		// Gera a linha a partir dos dados
		this.lineGenerator = d3.line();

		// Cria o path inicial
		this.path = this.objectDraw
			.append("path")
			.attr("stroke", this.#strokeColor)
			.attr("fill", this.#fill)
			.attr("stroke-width", this.#strokeWidth);

		// Desenha o shape inicial
		this.updatePath();
	}

	// Método para atualizar o caminho do shape baseado nos dados, posição, rotação e escala atuais
	updatePath() {
		// Cria a string do caminho baseado nos pontos de dados
		const pathString = this.lineGenerator(this.#data);

		// Atualiza o atributo "d" do path e aplica transformações de rotação e escala
		this.path.attr("d", pathString);
		this.path
			.attr(
				"transform",
				`translate(${this.#position[0]}, ${-this.#position[1]}) rotate(${-this
					.#angle}) scale(${this.#scale[0]}, ${this.#scale[1]})`
			)
			.attr("stroke", this.#strokeColor)
			.attr("fill", this.#fill)
			.attr("stroke-width", this.#strokeWidth);
	}

	set fill(color) {
		this.#fill = color;
		this.updatePath();
	}

	set strokeWidth(width) {
		this.#strokeWidth;
		this.updatePath();
	}

	set strokeColor(color) {
		this.#strokeColor = color;
		this.updatePath();
	}

	// Método setter para os dados (atualiza os dados e redesenha o shape)
	set data(newData) {
		this.#data = newData; // Atualiza os dados internos
		this.updatePath(); // Redesenha o shape
	}

	// Método getter para os dados (retorna os dados atuais)
	get data() {
		return this.#data;
	}

	// Método setter para a posição (atualiza a posição e redesenha o shape)
	set position(newPosition) {
		this.#position = newPosition; // Atualiza a posição interna
		this.updatePath(); // Redesenha o shape na nova posição
	}

	// Método getter para a posição (retorna a posição atual)
	get position() {
		return this.#position; // Retorna a posição interna
	}

	// Método setter para o ângulo (atualiza o ângulo e redesenha o shape)
	set angle(newAngle) {
		this.#angle = newAngle; // Atualiza o ângulo interno
		this.updatePath(); // Redesenha o shape com a nova rotação
	}

	// Método getter para o ângulo (retorna o ângulo atual)
	get angle() {
		return this.#angle; // Retorna o ângulo interno
	}

	// Método setter para a escala (atualiza a escala e redesenha o shape)
	set scale(newScale) {
		this.#scale = newScale; // Atualiza a escala interna
		this.updatePath(); // Redesenha o shape com a nova escala
	}

	// Método getter para a escala (retorna a escala atual)
	get scale() {
		return this.#scale; // Retorna a escala interna
	}

	set id(value) {
		this.#id = value;
	}

	get id() {
		return this.#id;
	}
}
