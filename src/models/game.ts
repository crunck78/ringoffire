import { DocumentData } from '@angular/fire/firestore';
import { Player, PlayerInterface } from './player';

export interface GameInterface {
    players: PlayerInterface[];
    stack: string[];
    playedCards: string[];
    currentPlayer: number;
    pickCardAnimation: boolean;
    currentCard: string | undefined;
}

export class Game implements DocumentData {
    public players: any[];
    public stack: string[];
    public playedCards: string[];
    public currentPlayer: number;
    public pickCardAnimation: boolean;
    public currentCard: string | undefined;

    constructor(game?: GameInterface) {
        this.currentPlayer = game ? game.currentPlayer : 0;
        this.stack = game ? game.stack : this.initStack();
        this.playedCards = game ? game.playedCards : [];
        this.players = game ? game.players.map(p => new Player(p)) : [];
        this.pickCardAnimation = game ? game.pickCardAnimation : false;
        this.currentCard = game ? game.currentCard : '';
    }

    initStack() {
        let newStack = [];
        for (let i = 1; i < 14; i++) {
            newStack.push('spade_' + i);
            newStack.push('hearts_' + i);
            newStack.push('clubs_' + i);
            newStack.push('diamonds_' + i);
        }

        shuffle(newStack);
        return newStack;
    }

    public toJson() {
        return {
            players: this.players.map(p => p.toJson()),
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard
        };
    }
}

function shuffle(array: any) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Firestore data converter
const gameConverter = {
    toFirestore: (game) => {
        return {
            players: game.players,
            stack: game.stack,
            playedCards: game.playedCards,
            currentPlayer: game.currentPlayer,
            pickCardAnimation: game.pickCardAnimation,
            currentCard: game.currentCard
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Game(data);
    }
};