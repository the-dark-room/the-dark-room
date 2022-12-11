import Phaser from "phaser";

// firestore stuff
import { db } from '../firebaseConfig'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc, setDoc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc,
} from "firebase/firestore";

// global playerinitials here...
let playerInitials;

let scores = [];

function getLeaderboard() {
  const scoreCollectionRef = collection(db, 'highscore')
  const q = query(scoreCollectionRef, orderBy('score', 'desc'))
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      // console.log(doc.data())
      scores.push({ ...doc.data(), id: doc.id })
    })
  })
  return scores;
  // console.log(scores);
}

// have to do this roundabout way of passing the scene around because Firestore expects to be using React,
// so I'm tricking it (not really; just passing "this.scene" into the function so we can use it)
const handleSceneChange = (scene, time) => {
  scene.start('leaderboard', { currentTime: time })
}

export default class EnterName extends Phaser.Scene {
  exitTime = 0;

  constructor() {
    super("entername");
  }

  preload() {
    this.load.html("nameform", "/nameForm.html");
    getLeaderboard()
  }

  create() {
    this.input.keyboard.clearCaptures()

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;
    let scoreTime = this.exitTime; // so we don't have "this" shadowing problems (just accept that we need this and then no touchie)

    let form = `
      <input type="text" name="nameField" placeholder="Initials" maxLength="3" style="font-size: 5%">
      <input type="button" name="playButton" value="Submit" style="font-size: 5% ">
      `;

    const text1 = this.add
      .text(
        screenCenterX,
        screenCenterY - screenCenterY / 4,
        `Your score was ${this.exitTime}`
      )
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    const text2 = this.add
      .text(
        screenCenterX,
        screenCenterY,
        "Enter your initials for the Leaderboard"
      )
      .setOrigin(0.5);
    text2.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    let element = this.add
      .dom(screenCenterX, screenCenterY + screenCenterY / 4)
      .createFromHTML(form);

    element.addListener("click");

    const scenePasser = this.scene;

    element.on("click", function (event) {
      if (event.target.name === "playButton") {
        let inputText = this.getChildByName('nameField')
        playerInitials = inputText.value
        handleNamePost(scoreTime)

        // getLeaderboard()
        // if(scores) {
        // scores.forEach((score) => { console.log("AAA", score) })
        // }
      }
    });
    function handleNamePost(time) {
      const playerRef = collection(db, 'highscore')
      setDoc(doc(playerRef), {
        name: playerInitials,
        score: time,
      }).then(handleSceneChange(scenePasser, time))
    }


  }

  update() {}

  // handleSceneChange() {
  //   this.scene.start('leaderboard')
  // }

}
