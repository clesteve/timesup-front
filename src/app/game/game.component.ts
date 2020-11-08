import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataService } from '../data.service';
import { SSEService } from '../sse.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private sseService: SSEService,
    private snackbar: MatSnackBar,
    private router: Router) { }

  gameId = '';
  username = '';
  isAdmin = false;
  initialValue = 60 * 1000;
  chronovalue = 60;
  character = { id: '' };
  sse: Subscription;

  users = [];
  teams = [];

  round = 0;
  currentPlayer = 0;
  chrono = { started: false, begin: new Date() };
  interval = interval(1000);
  subscribe: Subscription;

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
      this.round = parsed.round;
      this.currentPlayer = parsed.current_user;
      this.chrono = parsed.chrono;
      if (parsed.end) {
        this.router.navigate(['results']);
      }
      if (parsed.users[parsed.current_user] === localStorage.getItem('username')) {
        this.dataService.getCharacter(this.gameId).subscribe(res => {
          this.character = res.character;
          console.log(res.character);
        });
      }
      this.subscribe = this.interval.subscribe(x => this.getChrono(x, this.chrono, this.snackbar));
    });
    this.sse = this.sseService.getServerSentEvent(url).subscribe(resp => {
      const parsed = JSON.parse(resp.data);
      console.log(parsed);
      this.users = parsed.users;
      this.teams = parsed.teams;
      this.isAdmin = (this.username === parsed.admin);
      this.round = parsed.round;
      this.currentPlayer = parsed.current_user;
      this.chrono = parsed.chrono;
      if (parsed.end) {
        this.router.navigate(['results']);
      }
      if ((parsed.users[parsed.current_user] === this.username) && !this.character.id) {
        this.dataService.getCharacter(this.gameId).subscribe(res => {
          this.character = res.character;
          console.log(res.character);
        });
      }
    });
  }

  quitGame() {
    this.dataService.quitGame(this.gameId, this.username).subscribe(resp => {
      this.snackbar.open('Disconnected !', '', { duration: 1000 });
      this.router.navigate(['/']);
      this.subscribe.unsubscribe();
    });
  }

  currentlyPlaying() {
    return this.users[this.currentPlayer] === this.username;
  }

  startChrono() {
    this.dataService.startChrono(this.gameId).subscribe(res => {
      console.log(res);
      this.character = res.character;
      this.snackbar.open('Chrono Started !', '', { duration: 1000 });
    });
  }

  getChrono(x, chrono, snackbar) {
    if (chrono.started) {
      let value = this.initialValue + 60*60*1000 - (new Date().valueOf()) + (new Date(chrono.begin).valueOf());
      if (value <= 0) {
        chrono.started = false;
        value = this.initialValue;
        snackbar.open('End of chrono time, next player', '', { duration: 1000 });
        this.dataService.nextPlayer(this.gameId).subscribe(res => {
          console.log(res);
        });
      }
      this.chronovalue = Math.floor(value / 1000);
    }
  }

  pass() {
    this.dataService.passCharacter(this.gameId).subscribe(res => {
      console.log(res);
      this.character = res.character;
    });
  }

  discovered() {
    this.dataService.discover(this.gameId, this.username, this.character.id).subscribe(res => {
      console.log('discovered ! ');
      console.log(res);
      this.character = res.character;
    });
  }
  ngOnDestroy() {
    this.sse.unsubscribe();
  }
}
