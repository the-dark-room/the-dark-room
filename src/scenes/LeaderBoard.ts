import Phaser from "phaser";
// firestore stuff
import { db } from '../firebaseConfig'
import { 
  getFirestore, collection, onSnapshot, 
  addDoc, deleteDoc, doc, setDoc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc, getDocs,
} from "firebase/firestore";

let scores = [];

// function getLeaderboard() {
//   const scoreCollectionRef = collection(db, 'highscore')
//   const q = query(scoreCollectionRef, orderBy('score', 'desc'))
//   onSnapshot(q, (snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       // console.log(doc.data())
//       scores.push({ ...doc.data(), id: doc.id })
//     })
//   })
//   return scores;
//   // console.log(scores);
// }

// const leaderboardScores = (scene, screenX, screenY, scores) => {
//   for(let i=0; i<11; i++) {
//     scene.add.text(screenX, screenY, scores[i].name, scores[i].score)
//       .setOrigin(i / 2)
//   }
// }


export default class LeaderBoard extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("leaderboard");
  }

  preload() {
    this.load.html("nameform", "nameForm.html");
    // getLeaderboard()
  }

  leaderboardScores(x, y, score) {
    console.log(score)
      for(let i=0; i<11; i++) {
        this.add.text(x, y, score[i]?.name, score[i]?.score)
          .setOrigin(i / 2)
      }
    }

  // Firestore stuff returns a promise, so we need async
  async create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;

    const text1 = this.add
      .text(screenCenterX, 20, `LEADERBOARD`)
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);

    const scoreCollectionRef = collection(db, 'highscore')
    const q = query(scoreCollectionRef, orderBy('score', 'desc'))
    const querySnapshot = await getDocs(q)

    let count = 40; // used to set the X for the leaderboard items
    querySnapshot.forEach((doc) => {
      scores.push({ ...doc.data(), id: doc.id })
    })

    // we only want at most 10 names to display on the board, so in the case that 10 names are not 
    // present, we'll just use the length of "scores" for the loop
    if(scores.length <= 10) {
      for(let i=0; i < scores.length; i++) {
        count += 15;
        this.add.text(screenCenterX, count, `${i+1}. ${scores[i].name}  SCORE: ${scores[i].score}`)
          .setOrigin(0.5)
          .setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
      }
    } else {
      for(let i=0; i < 10; i++) {
          count += 15;
          this.add.text(screenCenterX, count, `${i+1}. ${scores[i].name}  SCORE: ${scores[i].score}`)
            .setOrigin(0.5)
            .setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
        }
    }

    // playagain button that takes them to the menu
    let playAgainButton = `
        <button name="playAgainButton" style="font-size: 5%; color: #00e7ff; background-color:black"
        >Play Again?</button>
      `
    
    let element = this.add
      .dom(screenCenterX, count+15)
      .createFromHTML(playAgainButton);

    const scenePasser = this.scene;

    element.addListener("click");
    element.on('click', function (evt) {
      console.log('clicked');
      console.log(scenePasser);
      scenePasser.start('menu')
    })

  }

  update() {}
}
