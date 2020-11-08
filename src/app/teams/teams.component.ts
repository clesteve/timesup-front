import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from '../data.service';
import { SSEService } from '../sse.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.sass']
})
export class TeamsComponent implements OnInit, OnDestroy {

  constructor(
    private sseService: SSEService,
    private dataService: DataService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  gameId = '';
  username = '';
  users = [];
  teams = [];
  isAdmin = false;
  submitted = [];
  admin = '';
  sse: Subscription;

  ngOnInit() {
    this.gameId = localStorage.getItem('gameId');
    this.username = localStorage.getItem('username');
    const url = environment.server_url + 'stream/' + this.gameId;
    this.dataService.getGame(this.gameId, this.username).subscribe(resp => {
      const parsed = JSON.parse(resp.game);
      console.log(parsed);
      this.users = parsed.users;
      this.teams = parsed.teams;
      this.isAdmin = (this.username === parsed.admin);
      this.submitted = parsed.submitted;
      this.admin = parsed.admin;
      if (parsed.round > -1) {
        this.snackbar.open('Game Started !', '', { duration: 1000 });
        this.router.navigate(['play']);
      }
    });
    this.sse = this.sseService.getServerSentEvent(url).subscribe(resp => {
      const parsed = JSON.parse(resp.data);
      console.log(parsed);
      this.users = parsed.users;
      this.teams = parsed.teams;
      this.isAdmin = (this.username === parsed.admin);
      this.submitted = parsed.submitted;
      if (parsed.round > -1) {
        this.snackbar.open('Game Started !', '', { duration: 1000 });
        this.router.navigate(['play']);
      }
    });
  }

  quitGame() {
    this.dataService.quitGame(this.gameId, this.username).subscribe(resp => {
      this.snackbar.open('Disconnected !', '', { duration: 1000 });
      this.router.navigate(['/']);
    });
  }

  canGenerateTeams() {
    return (this.users.length > 3) && (this.users.length % 2 === 0);
  }

  generateTeams() {
    this.dataService.generateTeams(this.gameId).subscribe(res => { console.log(res); });
  }

  startGame() {
    this.dataService.nextRound(this.gameId).subscribe(res => { console.log(res); });
  }

  ngOnDestroy() {
    this.sse.unsubscribe();
  }


}
