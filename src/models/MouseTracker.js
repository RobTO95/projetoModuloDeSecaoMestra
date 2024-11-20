import { pointer } from "d3";

export default class MouseTracker {
	#mousePosition;
	#svgContainer;
	constructor(svgContainer) {
		this.#svgContainer = svgContainer;
		this.#mousePosition = { x: null, y: null };
		this.precision = 4;
		this.updateMousePosition = this.updateMousePosition.bind(this);

		this.#svgContainer.parentElement.addEventListener(
			"pointermove",
			this.updateMousePosition
		);
	}
	get mousePosition() {
		return this.#mousePosition;
	}
	set mousePosition(point) {
		const x = point.x.toFixed(this.precision);
		const y = point.y.toFixed(this.precision);
		this.#mousePosition = { x, y };
	}
	get svgContainer() {
		return this.#svgContainer;
	}
	updateMousePosition(event) {
		const [x, y] = pointer(event, this.#svgContainer);

		this.#mousePosition.x = x.toFixed(this.precision);
		this.#mousePosition.y = y.toFixed(this.precision);
	}
}
