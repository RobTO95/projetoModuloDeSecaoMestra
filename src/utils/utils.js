import * as d3 from "d3";

export function getDrawScreenDimensions(svgElement) {
	const bbox = svgElement.getBoundingClientRect();
	const width = bbox.width;
	const height = bbox.height;
	return { width, height };
}

export function getMousePosition(svgElement, gridSize, event) {
	const position = d3
		.pointer(event, svgElement)
		.map((value) => Number((value / gridSize).toFixed(0)) * gridSize);
	// console.log(position);
	position[0] = position[0] - getDrawScreenDimensions(svgElement).width / 2;
	position[1] = getDrawScreenDimensions(svgElement).height / 2 - position[1];
	return [position[0], position[1]];
}
