import Phaser from "phaser";

export default class LoreTemplate extends Phaser.Scene {

    constructor() {
		super('lore')
	}

	preload() {
	}

	create(obj) {
        this.cameras.main.transparent = false
        this.cameras.main.setBackgroundColor('#000000')

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // const text1 = this.add.text(screenCenterX, screenCenterY, obj.text).setOrigin(0.5)
        // text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
        
        const text1 = this.make.text({
            x: screenCenterX,
            y: screenCenterY,
            text: obj.text,
            origin: { x: 0.5, y: 0.5 },
            style: {
                wordWrap: { width: this.cameras.main.width - 5 }
            }
        })
        text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);

        this.input.on('pointerdown', function (pointer) {
            this.scene.resume('game')
            this.scene.stop()
        }, this)

    }

    update() {
    }
}