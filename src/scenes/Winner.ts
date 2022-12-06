import Phaser from "phaser";

export default class Winner extends Phaser.Scene {

    constructor() {
		super('winner')
	}

	preload() {
	}

	create() {
        const text1 = this.add.text(20, 50, "Shadow Stroke", { font: "74px Arial Black", fill: "#c51b7d" });
        text1.stroke = "#de77ae";
        text1.strokeThickness = 16;
        //  Apply the shadow to the Stroke only
        text1.setShadow(2, 2, "#333333", 2, true, false);
    }

    update() {
    
    }
}