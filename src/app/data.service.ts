import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  getGame(id, username) {
    return this.http.get<any>(environment.server_url + 'games/' + id, { params: { username } });
  }
  quitGame(id, username) {
    return this.http.get<any>(environment.server_url + 'quit/' + id, { params: { username } });
  }
  createGame(username) {
    return this.http.post<any>(environment.server_url + 'games', {}, { params: { username } });
  }
  generateTeams(id) {
    return this.http.get<any>(environment.server_url + 'teams/' + id);
  }
  nextRound(id) {
    return this.http.get<any>(environment.server_url + 'round/' + id);
  }
  sendCharacters(username, id, characters) {
    return this.http.post<any>(environment.server_url + 'characters/' + id, { characters, username });
  }
  startChrono(id) {
    return this.http.get<any>(environment.server_url + 'chrono/' + id);
  }
  nextPlayer(id) {
    return this.http.get<any>(environment.server_url + 'player/' + id);
  }
  discover(id, username, character) {
    return this.http.get<any>(environment.server_url + 'discovered/' + id, { params: { username, character } });
  }
  getFullGame(id) {
    return this.http.get<any>(environment.server_url + 'results/' + id);
  }
  getCharacter(id) {
    return this.http.get<any>(environment.server_url + 'character/' + id);
  }
  passCharacter(id) {
    return this.http.get<any>(environment.server_url + 'pass/' + id);
  }
}
