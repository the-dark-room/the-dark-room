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

  async create() {
    console.log(scores)
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;

    const text1 = this.add
      .text(screenCenterX, screenCenterY, `THIS IS THE LEADERBOARD ${this.exitTime}`)
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);

    // const leaderboardScores = () => {
    //   for(let i=0; i<11; i++) {
    //     this.add.text(screenCenterX, screenCenterY, scores[i].name, scores[i].score)
    //       .setOrigin(i / 2)
    //   }
    // }

      const scoreCollectionRef = collection(db, 'highscore')
      const q = query(scoreCollectionRef, orderBy('score', 'desc'))
      const querySnapshot = await getDocs(q)
      let count = 0;
      querySnapshot.forEach((doc) => {
        console.log(count)
        count += 3;
        // console.log(doc.id, " => ", doc.data())
        scores.push({ ...doc.data(), id: doc.id })
        this.add.text(screenCenterX, screenCenterY+count, `NAME: ${doc.data().name}  SCORE: ${doc.data().score}`)
          // .setOrigin(count)
          .setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
      })
      console.log(scores)


      // onSnapshot(q, (snapshot) => {
      //   snapshot.docs.forEach((doc) => {
      //     // console.log(doc.data())
      //     scores.push({ ...doc.data(), id: doc.id })
      //   })
      // })
    

    // const leaderboardScores = () => {
    //   for(let i=0; i<11; i++) {
    //     this.add.text(screenCenterX, screenCenterY, scores[i].name, scores[i].score)
    //       .setOrigin(i / 2)
    //   }
    // }

    // let element = this.add
    //   .dom(400, 300)
    //   .createFromCache("nameform")
    //   .setDepth(10);
    // console.log(this.scene)
  }

  update() {}
}
