import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase} from '@angular/fire/database';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private router: Router, private database: AngularFireDatabase) { }

  ngOnInit(): void {
  }

  newGame() {
    //Start game
    let game = new Game();
    //let game = {};
    this.useFireStore(game);
    //this.useDatabase(game);
  }

  useFireStore(game: Game){
    this
      .firestore.
      collection('games')
      .add(game.toJson())
      .then((gameInfo: any) => {
        console.log(gameInfo);
        this.router.navigateByUrl('/game/' +gameInfo.id);
      });
  }

  useDatabase(game: Game){
    let key = this
      .database
      .list('games/')
      .push(game.toJson()).key;
      this.router.navigateByUrl('/game/' + key);
  }

}
