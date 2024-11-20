import * as d3 from "d3";

export default class ShapeSelectionBrush {
	constructor(svg, shapeList) {
		this.svg = svg; // SVG onde o brush será aplicado
		this.shapeList = shapeList; // Lista de shapes com coordenadas e dimensões
		this.selectionBox = null; // Posição da caixa de seleção
		this.initialPoint = null; // Ponto inicial do brush
		this.direction = "leftToRight"; // Direção do arrasto (padrão para esquerda-direita)

		// Configurando o brush
		this.brush = d3
			.brush()
			.extent([
				[0, 0],
				[svg.attr("width"), svg.attr("height")],
			])
			.on("start", this.brushStarted.bind(this))
			.on("brush", this.brushed.bind(this))
			.on("end", this.brushEnded.bind(this));

		// Adiciona o brush ao SVG
		this.svg.append("g").attr("class", "brush").call(this.brush);
	}

	// Evento iniciado quando o brush começa
	brushStarted(event) {
		this.initialPoint = d3.pointer(event);
	}

	// Evento executado enquanto o brush está em andamento
	brushed(event) {
		if (!event.selection) return;

		// Atualiza a posição da seleção
		this.selectionBox = event.selection;

		// Calcula a direção do arrasto
		const currentPoint = d3.pointer(event);
		this.direction =
			currentPoint[0] > this.initialPoint[0]
				? "leftToRight" // Arrasto da esquerda para a direita
				: "rightToLeft"; // Arrasto da direita para a esquerda

		// Aplica a lógica de seleção de acordo com a direção
		this.applySelection();
	}

	// Evento executado ao final do brush
	brushEnded(event) {
		if (!event.selection) return;

		// Limpa a seleção do brush
		d3.select(this.svg.node()).select(".brush").call(this.brush.move, null);
	}

	// Aplica a seleção de shapes com base na direção do brush
	applySelection() {
		this.shapeList.forEach((shape) => {
			const { x, y, width, height } = shape; // Assumindo que cada shape tem x, y, width, height

			// Verifica a intersecção completa ou parcial com a área do brush
			const isInsideCompletely =
				x >= this.selectionBox[0][0] &&
				y >= this.selectionBox[0][1] &&
				x + width <= this.selectionBox[1][0] &&
				y + height <= this.selectionBox[1][1];

			const isInsidePartially =
				x < this.selectionBox[1][0] &&
				x + width > this.selectionBox[0][0] &&
				y < this.selectionBox[1][1] &&
				y + height > this.selectionBox[0][1];

			// Define a condição de seleção com base na direção
			const shouldSelect =
				this.direction === "leftToRight"
					? isInsideCompletely // Esquerda para direita: seleciona shapes completamente dentro
					: isInsidePartially; // Direita para esquerda: seleciona shapes parcialmente dentro

			// Atualiza a classe CSS para visualização de seleção
			d3.select(shape.element).classed("selected", shouldSelect);
		});
	}
}
