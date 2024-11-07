export function initializeCommandBar(shapeController) {
	const commandInput = document.getElementById("command-input-bar");
	const commandEnterButton = document.getElementById("command-input-enter");
	const commandSuggestions = document.getElementById("command-suggestions");

	const commands = {
		undo: () => shapeController.undo(),
		redo: () => shapeController.redo(),
		"add shape": () =>
			console.log("Implementar a adição de shapes pela command bar"),
		"remove shape": () =>
			console.log("Implementar a remoção de shapes pela command bar"),
	};

	const availableCommands = Object.keys(commands);

	function showSuggestions(inputText) {
		commandSuggestions.innerHTML = "";

		const filteredCommands = availableCommands.filter((command) =>
			command.startsWith(inputText)
		);

		if (filteredCommands.length > 0) {
			commandSuggestions.style.display = "flex";
			commandSuggestions.style.flexDirection = "column-reverse";

			filteredCommands.forEach((command) => {
				const suggestionItem = document.createElement("li");
				suggestionItem.textContent = command;
				suggestionItem.addEventListener("click", () => {
					commandInput.value = command;
					commandSuggestions.innerHTML = "";
				});
				commandSuggestions.appendChild(suggestionItem);
			});
		} else {
			commandSuggestions.style.display = "none";
		}
	}

	function processCommand(command) {
		const action = commands[command];
		if (action) {
			action();
		} else {
			console.error("Comando não reconhecido:", command);
		}
	}

	function executeCommand() {
		const command = commandInput.value.trim().toLowerCase();
		if (command) {
			processCommand(command);
			commandInput.value = "";
			commandSuggestions.innerHTML = "";
		}
	}

	commandInput.addEventListener("input", () => {
		const inputText = commandInput.value.toLowerCase();
		showSuggestions(inputText);
	});

	commandEnterButton.addEventListener("click", executeCommand);

	commandInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			executeCommand();
		}
	});

	document.addEventListener("click", (event) => {
		if (
			!commandInput.contains(event.target) &&
			!commandSuggestions.contains(event.target)
		) {
			commandSuggestions.style.display = "none";
		}
	});
}
