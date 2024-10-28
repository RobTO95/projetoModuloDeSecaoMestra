import CustomShape from "./CustomShape";

class DefaultShape extends CustomShape {
	constructor(drawScreen) {
		super(drawScreen);
	}
	setDimensions() {
		throw new Error("This method must be overridden by subclasses");
	}
	getDimensions() {
		throw new Error("This method must be overridden by subclasses");
	}
	redraw() {
		throw new Error("This method must be overridden by subclasses");
	}
	// Método para limpar o desenho existente
	clear() {
		this.removePath(); // Remove o caminho anterior do SVG
	}
}

// ---------------------------------------------------------------------------------------------------------
export class LShapeBeam extends DefaultShape {
	constructor(
		drawScreen,
		legLength1,
		legLength2,
		thickness1,
		thickness2,
		radius1,
		radius2,
		radius3,
		radius4
	) {
		super(drawScreen);
		this.setDimensions(
			legLength1,
			legLength2,
			thickness1,
			thickness2,
			radius1,
			radius2,
			radius3,
			radius4
		);
	}

	// Método para atualizar as dimensões
	setDimensions(
		legLength1,
		legLength2,
		thickness1,
		thickness2,
		radius1,
		radius2,
		radius3,
		radius4
	) {
		this.legLength1 = legLength1;
		this.legLength2 = legLength2;
		this.thickness1 = thickness1;
		this.thickness2 = thickness2;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.radius3 = radius3;
		this.radius4 = radius4;

		// Redesenha o shape com as novas dimensões
		this.redraw();
	}

	// método getDimensions para retornar as dimensões do perfil L
	getDimensions() {
		return {
			legLength1: this.legLength1,
			legLength2: this.legLength2,
			thickness1: this.thickness1,
			thickness2: this.thickness2,
			radius1: this.radius1,
			radius2: this.radius2,
			radius3: this.radius3,
			radius4: this.radius4,
		};
	}

	// Método para redesenhar o shape
	redraw() {
		// Limpa o desenho existente
		this.clear();

		// Redesenha o shape com as dimensões atuais
		this.arc(this.radius1, this.radius1, this.radius1, 180, 270, false);
		this.line(this.legLength1, 0);
		this.arc(
			this.legLength1 - this.radius2,
			this.radius2 > 0 ? this.thickness1 - this.radius2 : this.thickness1,
			this.radius2,
			0,
			90,
			false
		);
		this.arc(
			this.thickness2 + this.radius3,
			this.thickness1 + this.radius3,
			this.radius3,
			270,
			180,
			true
		);
		this.arc(
			this.radius4 > 0 ? this.thickness2 - this.radius4 : this.thickness2,
			this.legLength2 - this.radius4,
			this.radius4,
			0,
			90,
			false
		);
		this.line(0, this.legLength2);
		this.close();
	}

	// Método para limpar o desenho existente
	clear() {
		this.removePath(); // Remova o caminho anterior do SVG
	}
}

// ---------------------------------------------------------------------------------------------------------
export class TShapeBeam extends DefaultShape {
	constructor(
		drawScreen,
		soulLength,
		soulThickness,
		flangeLength,
		flangeThickness
	) {
		super(drawScreen);
		this.setDimensions(
			soulLength,
			soulThickness,
			flangeLength,
			flangeThickness
		);
	}

	// Método para atualizar as dimensões
	setDimensions(soulLength, soulThickness, flangeLength, flangeThickness) {
		this.soulLength = soulLength;
		this.soulThickness = soulThickness;
		this.flangeLength = flangeLength;
		this.flangeThickness = flangeThickness;

		// Redesenha o shape com as novas dimensões
		this.redraw();
	}
	// Método getDimensions para retornar as dimensões do perfil T
	getDimensions() {
		return {
			soulLength: this.soulLength,
			soulThickness: this.soulThickness,
			flangeLength: this.flangeLength,
			flangeThickness: this.flangeThickness,
		};
	}

	// Método para redesenhar o shape
	redraw() {
		// Limpa o desenho existente
		this.clear();

		// Redesenha o shape com as dimensões atuais
		// this.anchor(0, 0);
		// this.line(this.soulThickness / 2, 0);
		// this.line(this.soulThickness / 2, this.soulLength);
		// this.line(this.flangeLength / 2, this.soulLength);
		// this.line(this.flangeLength / 2, this.soulLength + this.flangeThickness);
		// this.line(0, this.soulLength + this.flangeThickness);
		// this.line(-(this.flangeLength / 2), this.soulLength + this.flangeThickness);
		// this.line(-(this.flangeLength / 2), this.soulLength);
		// this.line(-(this.soulThickness / 2), this.soulLength);
		// this.line(-(this.soulThickness / 2), 0);
		// this.close();
		this.anchor(0, 0);
		this.line(this.soulThickness / 2, 0);
		this.line(this.soulThickness / 2, this.soulLength);
		this.line(this.flangeLength / 2, this.soulLength);
		this.line(
			this.flangeLength / 2,
			this.soulLength + this.flangeThickness / 2
		);
		this.line(this.flangeLength / 2, this.soulLength + this.flangeThickness);
		this.line(0, this.soulLength + this.flangeThickness);
		this.line(-this.flangeLength / 2, this.soulLength + this.flangeThickness);
		this.line(
			-this.flangeLength / 2,
			this.soulLength + this.flangeThickness / 2
		);
		this.line(-this.flangeLength / 2, this.soulLength);
		this.line(-this.soulThickness / 2, this.soulLength);
		this.line(-this.soulThickness / 2, 0);

		this.close();
	}

	// Método para limpar o desenho existente
	clear() {
		this.removePath(); // Remove o caminho anterior do SVG
	}
}

// ---------------------------------------------------------------------------------------------------------

export class Plate extends DefaultShape {
	constructor(drawScreen, length, thickness) {
		super(drawScreen);
		this.length = length;
		this.thickness = thickness;
		this.setDimensions(this.length, this.thickness);
	}
	setDimensions(length, thickness) {
		this.length = length;
		this.thickness = thickness;
		this.redraw();
	}
	getDimensions() {
		return {
			length: this.length,
			thickness: this.thickness,
		};
	}
	redraw() {
		this.clear();

		this.anchor(this.length / 2, -this.thickness / 2);
		this.line(this.length / 2, -this.thickness / 2);
		this.line(this.length / 2, this.thickness / 2);
		this.line(this.length / 2, this.thickness / 2);
		this.line(-this.length / 2, this.thickness / 2);
		this.line(-this.length / 2, -this.thickness / 2);

		// this.anchor(0, 0);
		// this.line(this.length, 0);
		// this.line(this.length, this.thickness);
		// this.line(0, this.thickness);
		this.close();
	}
}

// ---------------------------------------------------------------------------------------------------------
export class RadiusPlate extends DefaultShape {
	constructor(drawScreen, thickness, firstPoint, secondPoint, endPoint) {
		super(drawScreen);
		this.thickness = thickness;
		this.firstPoint = firstPoint;
		this.secondPoint = secondPoint;
		this.endPoint = endPoint;
	}
	setDimensions(thickness, firstPoint, secondPoint, endPoint) {
		this.thickness = thickness;
		this.firstPoint = firstPoint;
		this.secondPoint = secondPoint;
		this.endPoint = endPoint;
		this.redraw();
	}
	getDimensions() {
		return {
			thickness: this.thickness,
			firstPoint: this.firstPoint,
			secondPoint: this.secondPoint,
			endPoint: this.endPoint,
		};
	}
	redraw() {
		this.clear();
	}
}
