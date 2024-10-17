import CustomShape from "./CustomShape";

export default class LShapedBeam extends CustomShape {
	constructor(
		drawScreen,
		legLength1,
		legLength2,
		thickness1,
		thickness2,
		radius1 = 0,
		radius2 = 0,
		radius3 = 0,
		radius4 = 0
	) {
		super(drawScreen);
		this.legLength1 = legLength1;
		this.legLength2 = legLength2;
		this.thickness1 = thickness1;
		this.thickness2 = thickness2;
		this.radius = radius1;
		this.radius2 = radius2;
		this.radius3 = radius3;
		this.radius4 = radius4;

		// this.anchor(0, 0);

		this.arc(this.radius, this.radius, this.radius, 180, 270, false);

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
		// this.line(this.thickness2, this.legLength2);
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
}
