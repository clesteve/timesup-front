import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from '../data.service';
import { SSEService } from '../sse.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.sass']
})
export class CharactersComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sseService: SSEService
  ) { }

  characters = [''];
  gameId = '';
  username = '';
  isAdmin = false;
  users = [];
  submitted = [];

  ngOnInit() {
    this.gameId = localStorage.getItem('gameId');
    this.username = localStorage.getItem('username');
    const url = environment.server_url + 'stream/' + this.gameId;
    this.dataService.getGame(this.gameId, this.username).subscribe(resp => {
      const parsed = JSON.parse(resp.game);
      console.log(parsed);
      this.users = parsed.users;
      this.isAdmin = (this.username === parsed.admin);
      this.submitted = parsed.submitted;
      if (parsed.round > -1) {
        this.snackbar.open('Game Started !', '', { duration: 1000 });
        this.router.navigate(['play']);
      }
    });
    this.sseService.getServerSentEvent(url).subscribe(resp => {
      const parsed = JSON.parse(resp.data);
      console.log(parsed);
      this.users = parsed.users;
      this.isAdmin = (this.username === parsed.admin);
      this.submitted = parsed.submitted;
      if (parsed.round > -1) {
        this.snackbar.open('Game Started !', '', { duration: 1000 });
        this.router.navigate(['play']);
      }
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  submit() {
    this.dataService.sendCharacters(this.username, this.gameId, this.characters).subscribe(res => {
      this.snackbar.open('Characters subimtted !', '', { duration: 1000 });
      this.router.navigate(['teams']);
    });
  }

  quitGame() {
    this.dataService.quitGame(this.gameId, this.username).subscribe(resp => {
      this.snackbar.open('Disconnected !', '', { duration: 1000 });
      this.router.navigate(['/']);
    });
  }

}
