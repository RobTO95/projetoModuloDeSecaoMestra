export default class CommandBar {
	/**@param {HTMLDivElement} container  */
	constructor(container, enterButton) {
		this.container = container;
		this.enterButton = enterButton;
	}

	/**@param {String} message  */
	writeMessage(message) {
		this.container.innerHTML = message;
	}

	/**@param {...HTMLElement} htmls  */
	appendHTMLs(...htmls) {
		htmls.forEach((html) => {
			this.container.appendChild(html);
		});
	}

	visibleOn() {
		this.container.style.display = "block";
	}
	visibleOff() {
		this.container.style.display = "none";
	}
	clear() {
		this.container.innerHTML = "";
	}
}
