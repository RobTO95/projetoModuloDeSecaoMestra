import * as d3 from "d3";

export default class LineFeedBack {
	#firstPosition;
	#lastPosition;
	/**@param {HTMLElement} container  */
	constructor(container) {
		this.container = container;
		this.#firstPosition = { x: null, y: null };
		this.#lastPosition = { x: null, y: null };
		this.line = null;
		this.path = null;
		this.stroke = "white";
		this.strokeWidth = 0.5;
		this.dashArray = "5,5";
	}
	get firstPosition() {
		return this.#firstPosition;
	}

	set firstPosition(position) {
		this.#firstPosition = position;
	}
	get lastPosition() {
		return this.#lastPosition;
	}

	set lastPosition(position) {
		this.#lastPosition = position;
	}

	updateLine() {
		this.path = d3.path();
		this.path.moveTo(this.#firstPosition.x, this.#firstPosition.y);
		this.path.lineTo(this.#lastPosition.x, this.#lastPosition.y);
		if (!this.line) {
			this.line = d3.select(this.container).append("path");
			this.line.node().style.pointerEvents = "none";
		}
		this.line
			.attr("d", this.path.toString())
			.attr("stroke", this.stroke)
			.attr("stroke-width", this.strokeWidth)
			.attr("stroke-dasharray", this.dashArray)
			.attr("mix-blend-mode", "difference")
			.attr("class", "feedback-line");
	}
	clear() {
		this.container.removeChild(this.line.node());
		this.line = null;
	}
}
