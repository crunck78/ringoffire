import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game'
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  gameID: string;
  
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params.id);
      this.gameID = params.id;
      this
      .firestore
      .collection('games')
      .doc(this.gameID)
      .valueChanges()
      .subscribe((game: any) => {
        console.log('Game Update ', game);
        this.game.currentPlayer = game.currentPlayer;
        this.game.stack = game.stack;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;
      });

    });

  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      console.log(this.game.currentCard);
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      console.log('New Card', this.game.currentCard);
      console.log('Game is', this.game);
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        console.log('The dialog was closed', name);
        this.saveGame();
      }
    });
  }

  saveGame(){
    this
    .firestore
    .collection('games')
    .doc(this.gameID)
    .update(this.game.toJson());
  }

}
