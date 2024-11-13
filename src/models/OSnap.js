export default class Snap {
	constructor(svgContainer) {
		this.svgContainer = svgContainer; // Contêiner do SVG onde estão os shapes
		this.snapPoints = []; // Armazena pontos de snap para cada shape
		this.snapRadius = 10; // Raio de detecção para snapping
		this.activeSnapTypes = {
			endPoint: true,
			midPoint: true,
			center: true,
			centroid: true,
		};
	}

	clearSnapPoints() {
		this.snapPoints.length = 0;
	}

	// Método para detectar os pontos de interesse em um shape
	detectSnapPoints(shape) {
		if (!shape) {
			return;
		}

		if (this.activeSnapTypes.centroid) {
			this.snapPoints.push({
				type: "centroid",
				point: {
					x: shape.calculateCentroid()[0],
					y: shape.calculateCentroid()[1],
				},
			});
		}
		if (this.activeSnapTypes.endPoint) {
			const data = shape.data;
			data.forEach((command) => {
				if (command.type === "lineTo" || command.type === "moveTo") {
					this.snapPoints.push({
						type: "endPoint",
						point: {
							x: command.x + shape.position[0],
							y: command.y + shape.position[1],
						},
					});
				}
			});
		}
	}

	// Método para verificar se um ponto está próximo de outro ponto para snap
	findClosestSnapPoint(cursorPosition) {
		for (const snapPoint of this.snapPoints) {
			const distance = this.calculateDistance(cursorPosition, snapPoint.point);
			if (distance <= this.snapRadius) {
				return snapPoint; // Retorna o ponto de snap mais próximo
			}
		}
		return null;
	}

	// Método para calcular a distância entre dois pontos
	calculateDistance(point1, point2) {
		return Math.sqrt(
			Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
		);
	}

	// Método para ativar e desativar tipos de snapping
	setActiveSnapTypes(types) {
		this.activeSnapTypes = { ...this.activeSnapTypes, ...types };
	}

	// Método principal de snapping: detecta pontos e ajusta a posição do cursor
	snapTo(cursorPosition) {
		const closestSnapPoint = this.findClosestSnapPoint(cursorPosition);

		if (closestSnapPoint) {
			return closestSnapPoint; // Alinha o cursor no ponto de snap mais próximo
		}
		return null; // Retorna null se nenhum snap for encontrado
	}
}
