import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game, GameInterface } from 'src/models/game'
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Unsubscribe } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { Player } from 'src/models/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  readonly MINIMUM_PLAYERS = 2;
  game: Game = new Game();
  gameID: string;
  unsubscribeGameChanges: Unsubscribe;

  constructor(
    private firestoreService: FirestoreService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.unsubscribeGameChanges();
  }

  async ngOnInit(): Promise<void> {
    await this.loadGame();
    this.subscribeToGameChanges();
  }

  handleTakeCard() {
    if (this.canTakeCard())
      this.takeCard();
    else if (!this.hasGameMinimumPlayers())
      this.openSnackBar('First at Min '+this.MINIMUM_PLAYERS+' Players');
  }

  private hasGameMinimumPlayers(){
    return this.game.players.length >= this.MINIMUM_PLAYERS;
  }

  private canTakeCard() {
    return !this.game.pickCardAnimation &&
      this.hasGameMinimumPlayers();
  }

  private takeCard() {
    this.onCardTake();
    setTimeout(this.afterCardTake.bind(this), 1000);
  }

  private onCardTake() {
    this.game.pickCardAnimation = true;
    this.updateCurrentTakenCard();
    this.setNextPlayer();
    this.saveGame();
  }

  private updateCurrentTakenCard() {
    this.game.currentCard = this.game.stack.pop();
  }

  private setNextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  private afterCardTake() {
    this.game.pickCardAnimation = false;
    this.currentTakenCardToPlayedCards();
    this.saveGame();
  }

  private currentTakenCardToPlayedCards() {
    this.game.playedCards.push(this.game.currentCard);
  }

  openSnackBar(message : string) {
    this._snackBar.open(message, 'Ok', {
      duration: 3000
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((newPlayer?: Player) => {
      if (newPlayer) {
        this.game.players.push(newPlayer);
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.firestoreService
      .updateDocToCollection('games', this.gameID, this.game);
  }

  private async loadGame() {
    await this.setGameId();
    await this.setGame();
  }

  private async setGameId() {
    const paramMap = await firstValueFrom(this.route.paramMap);
    this.gameID = paramMap.get('id');
  }

  private async setGame() {
    const gameInterface = await this.firestoreService
      .getDocumentData('games', this.gameID) as GameInterface;
    this.game = new Game(gameInterface);
  }

  private subscribeToGameChanges() {
    this.unsubscribeGameChanges = this.firestoreService.onValueChanges('games', this.gameID, {
      next: docData => this.game = new Game(docData.data() as GameInterface)
    });
  }

}