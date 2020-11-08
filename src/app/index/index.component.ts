import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
    private snackbar: MatSnackBar) { }

  gameId = '';
  username = '';

  ngOnInit() {
    this.gameId = localStorage.getItem('gameId');
    this.username = localStorage.getItem('username');
  }

  getGame() {
    this.dataService.getGame(this.gameId, this.username).subscribe(res => {
      localStorage.setItem('username', this.username);
      localStorage.setItem('gameId', this.gameId);
      this.router.navigate(['characters']);
    },
      error => {
        this.snackbar.open(error.error.message, null, { duration: 1000 });
      });
  }

  createGame() {
    localStorage.removeItem('gameId');
    this.dataService.createGame(this.username).subscribe(res => {
      localStorage.setItem('username', this.username);
      localStorage.setItem('gameId', res.gameId);
      this.router.navigate(['characters']);
    });
  }

}
