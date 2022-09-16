import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Player } from 'src/models/player';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  newPlayer = new Player();

  imgs = [
    { path: 'assets/img/profile/1.webp', value: 'Male' },
    { path: 'assets/img/profile/2.png', value: 'Female' }
  ];

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }
}
