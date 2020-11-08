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
  game: any = { characters: {}, teams: {} };
  nbCharacters = 0;
  results: any = {};
  total = {};
  reducer = (accumulator, currentValue) => accumulator + currentValue;


  ngOnInit() {
    this.gameId = localStorage.getItem('gameId');
    this.username = localStorage.getItem('username');
    this.dataService.getFullGame(localStorage.getItem('gameId')).subscribe(resp => {
      this.game = JSON.parse(resp.game);
      this.nbCharacters = Object.keys(JSON.parse(resp.game).characters).length;
      for (const user of JSON.parse(resp.game).users) {
        this.results[user] = {};
        for (let round = 0; round < 3; round++) {
          this.results[user][round] = Object.values(JSON.parse(resp.game).characters).filter(
            (x: any) => x.discovered[round] === user).length;
        }
      }
    });
  }

  back() {
    localStorage.removeItem('gameId');
    this.dataService.quitGame(this.gameId, this.username).subscribe(resp => {
      this.router.navigate(['/']);
    });
  }

}
