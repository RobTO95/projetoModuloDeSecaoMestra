export default class CommandManager {
	constructor() {
		this.undoStack = [];
		this.redoStack = [];
	}

	executeCommand(command) {
		command.execute();
		this.undoStack.push(command);
		this.redoStack = []; // Limpa a pilha de redo sempre que um novo comando é executado
	}

	undo() {
		if (this.undoStack.length > 0) {
			const command = this.undoStack.pop();
			command.undo();
			this.redoStack.push(command);
		}
	}

	redo() {
		if (this.redoStack.length > 0) {
			const command = this.redoStack.pop();
			command.execute();
			this.undoStack.push(command);
		}
	}
}
