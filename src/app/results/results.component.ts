import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router) { }

  gameId = '';
  username = '';
  game = {};

  ngOnInit() {
    this.gameId = localStorage.getItem('gameId');
    this.username = localStorage.getItem('username');
    this.dataService.getFullGame(this.gameId).subscribe(resp => {
      this.game = JSON.parse(resp.game);
    });
  }

  back() {
    this.dataService.quitGame(this.gameId, this.username).subscribe(resp => {
      localStorage.removeItem('gameId');
      this.router.navigate(['/']);
    });
  }

}
