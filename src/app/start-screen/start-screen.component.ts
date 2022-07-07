import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private navigationService : NavigationService, private firestoreService: FirestoreService) { }

  newGame() {
    const newGame = new Game();
    this.firestoreService.addDocToCollection('games', newGame)
      .then(gameRef => this.openGame(gameRef.id))
      .catch(error => console.error("Could not open New Game", error));
  }

  openGame(gameId: string) {
    const gameUrl = '/game/' + gameId;
    this.navigationService.open(gameUrl);
  }
}
