import * as d3 from "d3";
import { getDrawScreenDimensions, getScaleSVG } from "../utils/utils";

export default class CursorStyle {
	/**@param {HTMLElement} svgContainer container onde estão os shapes */
	constructor(svgContainer, shapeController) {
		this.svgContainer = svgContainer;
		this.shapeController = shapeController;
		this.cursor = null;
		this.size = 10;
		this.svgContainer.parentElement.style.cursor = "none";
		this.initCursor();
		this.setupPointerMoveListener();
	}
	initCursor() {
		// const svgGroup = d3.select(this.svgContainer.querySelector("g"));

		const path = d3.path();

		path.moveTo(-this.size, -this.size);
		path.lineTo(this.size, -this.size);
		path.lineTo(this.size, this.size);
		path.lineTo(-this.size, this.size);
		path.closePath();
		path.moveTo(0, this.size * 5);
		path.lineTo(0, -this.size * 5);
		path.moveTo(this.size * 5, 0);
		path.lineTo(-this.size * 5, 0);

		this.cursor = d3
			.select(this.svgContainer)
			.append("path")
			.attr("d", path.toString())
			.attr("class", "cursor-style")
			.style("pointer-events", "none");

		// this.cursor = svgGroup.append("rect");

		// this.cursor
		// 	.attr("x", this.shapeController.mouseTracker.mousePosition.x - 5)
		// 	.attr("y", this.shapeController.mouseTracker.mousePosition.y - 5)
		// 	.attr("width", 10)
		// 	.attr("height", 10)
		// 	.attr("fill", "none")
		// 	.attr("stroke", "black")
		// 	.attr("stroke-width", 1)
		// 	.attr("transform", `translate(-50,-50)`)
		// 	.attr("class", "custom-cursor")
		// 	.style("pointer-events", "none"); // Impede que o cursor intercepte eventos.
	}
	setupPointerMoveListener() {
		this.svgContainer.parentElement.addEventListener("pointermove", (event) => {
			const point = this.shapeController.mouseTracker.mousePosition;

			const x = Number(point.x);
			const y = Number(point.y);
			this.updateCursorPosition(x, y);
		});
	}
	updateCursorPosition(x, y) {
		const svgScale = getScaleSVG(this.svgContainer);
		this.cursor.attr(
			"transform",
			`translate(${x}, ${y}) scale(${1 / svgScale.scaleX}, ${
				1 / svgScale.scaleY
			}) `
		);
		this.cursor.raise();
	}
}
