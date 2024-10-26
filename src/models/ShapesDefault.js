import CustomShape from "./CustomShape";

// ---------------------------------------------------------------------------------------------------------
export class LShapeBeam extends CustomShape {
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
}

// ---------------------------------------------------------------------------------------------------------
export class TShapeBeam extends CustomShape {
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

	// Método para redesenhar o shape
	redraw() {
		// Limpa o desenho existente
		this.clear();

		// Redesenha o shape com as dimensões atuais
		this.anchor(0, 0);
		this.line(this.soulThickness / 2, 0);
		this.line(this.soulThickness / 2, this.soulLength);
		this.line(this.flangeLength / 2, this.soulLength);
		this.line(this.flangeLength / 2, this.soulLength + this.flangeThickness);
		this.line(0, this.soulLength + this.flangeThickness);
		this.line(-(this.flangeLength / 2), this.soulLength + this.flangeThickness);
		this.line(-(this.flangeLength / 2), this.soulLength);
		this.line(-(this.soulThickness / 2), this.soulLength);
		this.line(-(this.soulThickness / 2), 0);
		this.close();
		this.position = [this.flangeLength / 2, 0];
	}

	// Método para limpar o desenho existente
	clear() {
		this.removePath(); // Remove o caminho anterior do SVG
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
}
