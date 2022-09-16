import { DocumentData } from '@angular/fire/firestore';

export interface PlayerInterface {
  name : string,
  img : string
}

export class Player implements DocumentData {
    public name : string;
    public img : string;

    constructor(player?: PlayerInterface) {
        this.name = player ? player.name : "Anonymous";
        this.img = player ? player.img : "";
    }

    public toJson() {
        return {
            name : this.name,
            img : this.img
        };
    }
}

// Firestore data converter
const playerConverter = {
    toFirestore: (player) => {
        return {
            name : player.name,
            img : player.img
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Player(data);
    }
};