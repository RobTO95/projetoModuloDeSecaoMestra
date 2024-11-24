export default class CommandBar {
	/**@param {HTMLDivElement} container  */
	constructor(containerMessage, inputBar, enterButton) {
		this.containerMessage = containerMessage;
		this.inputBar;
		this.enterButton = enterButton;
	}

	/**@param {String} message  */
	writeMessage(message) {
		this.containerMessage.innerHTML = message;
	}

	/**@param {...HTMLElement} htmls  */
	appendHTMLs(...htmls) {
		htmls.forEach((html) => {
			this.containerMessage.appendChild(html);
		});
	}

	visibleOn() {
		this.containerMessage.style.display = "block";
	}
	visibleOff() {
		this.containerMessage.style.display = "none";
	}
	clear() {
		this.containerMessage.innerHTML = "";
	}
}
