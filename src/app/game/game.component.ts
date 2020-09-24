import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game'
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation: boolean = false;
  game: Game;
  currentCard: string = '';

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.firestore.collection('games').valueChanges().subscribe((game)=>{
      console.log('Game Update ', game);
    });
  }

  newGame() {
    this.game = new Game();
    this.firestore.collection('games').add(this.game.toJson());
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =  this.game.currentPlayer % this.game.players.length;
    
      console.log('New Card',this.currentCard);
      console.log('Game is', this.game);
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
         this.game.players.push(name);
      console.log('The dialog was closed', name);
      }
    });
  }

}
