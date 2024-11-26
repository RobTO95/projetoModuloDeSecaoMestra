import { pointer } from "d3";

export default class MouseTracker {
	#mousePosition;
	#svgContainer;
	#orthoMode;
	constructor(svgContainer) {
		this.#svgContainer = svgContainer;
		this.#mousePosition = { x: null, y: null };
		this.precision = 4;
		this.isTouchDevice =
			"ontouchstart" in window || navigator.maxTouchPoints > 0;

		this.updateMousePosition = this.updateMousePosition.bind(this);
		this.handlePointerEvent = this.handlePointerEvent.bind(this);

		// Adiciona eventos para mouse e toque
		this.#svgContainer.parentElement.addEventListener(
			"pointerdown",
			this.handlePointerEvent
		);
		this.#svgContainer.parentElement.addEventListener(
			"pointermove",
			this.updateMousePosition
		);

		if (this.isTouchDevice) {
			this.#svgContainer.parentElement.addEventListener(
				"touchmove",
				this.updateMousePosition,
				{ passive: false } // Previne o scroll padrão
			);
		}
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

	get orthoMode() {
		return this.#orthoMode;
	}

	/**@param {Boolean} value  */
	set orthoMode(value) {
		this.#orthoMode = value;
	}

	updateMousePosition(event) {
		// Lida com dispositivos de toque
		let x, y;
		if (event.touches && event.touches.length > 0) {
			const touch = event.touches[0];
			[x, y] = pointer(touch, this.#svgContainer);
		} else {
			[x, y] = pointer(event, this.#svgContainer);
		}

		this.#mousePosition.x = Number(x.toFixed(this.precision));
		this.#mousePosition.y = Number(y.toFixed(this.precision));
	}

	handlePointerEvent(event) {
		// Evita o scroll no pointerdown para interações melhores
		if (this.isTouchDevice && event.type === "pointerdown") {
			event.preventDefault();
		}
	}
}
