import * as d3 from "d3";

// Classe Shape
export class Shape {
	constructor(svg, data = [], position = [0, 0]) {
		this.svg = d3.select(svg);
		this.data = data;
		this.position = position;
		this.isSelected = false; // Estado de seleção do shape

		// Gera a linha a partir dos dados
		const lineGenerator = d3.line();

		// Translada os dados do shape para a posição definida
		const translatedData = data.map(([x, y]) => [
			x + position[0],
			y + position[1],
		]);

		// Cria a string do caminho baseado nos pontos de dados
		const pathString = lineGenerator(translatedData);

		// Adiciona o path ao SVG
		this.path = this.svg
			.append("path")
			.attr("d", pathString)
			.attr("stroke", "black")
			.attr("fill", "steelblue")
			.attr("stroke-width", 1);
	}
}
