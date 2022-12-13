import Phaser from "phaser";

export default class Loser extends Phaser.Scene {

    private exitTime = 0


    constructor() {
		super('loser')
        // console.log(this)
	}

	preload() {
        // console.log(this)
	}

	create() {
        // console.log(`I'm in the create of the loser scene`)
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        // const loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading: 0%').setOrigin(0.5);

        // this.exitTime = this.scene.settings.data.currentTime

        const text1 = this.add.text(screenCenterX, screenCenterY, `You are lost in the dark...forever...`).setOrigin(0.5)
        text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
        // console.log(this.scene)
        // playagain button that takes them to the menu
            let playAgainButton = `
            <button name="playAgainButton" style="font-size: 5%; color: #00e7ff; background-color:black"
            >Play Again?</button>
        `

        let element = this.add
        .dom(screenCenterX, screenCenterY + 50)
        .createFromHTML(playAgainButton);

        const scenePasser = this.scene;

        element.addListener("click");
        element.on('click', function (evt) {
        console.log('clicked');
        console.log(scenePasser);
        scenePasser.start('menu')
        })

        
    }

    update() {

    }
}