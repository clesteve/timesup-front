import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharactersComponent } from './characters/characters.component';
import { GameComponent } from './game/game.component';
import { IndexComponent } from './index/index.component';
import { ResultsComponent } from './results/results.component';
import { TeamsComponent } from './teams/teams.component';

const routes: Routes = [
  { path: 'characters', component: CharactersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'play', component: GameComponent },
  { path: 'results', component: ResultsComponent },
  { path: '', component: IndexComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
