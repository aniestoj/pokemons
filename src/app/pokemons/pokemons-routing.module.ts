import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonsComponent } from './components/pokemons/pokemons.component';
import { DetailsComponent } from './components/details/details.component';
import { DetailsGuard } from './components/details/guard/details.guard';

const routes: Routes = [
  {
    path: '', component: PokemonsComponent
  },
  {
    path: ':id',
    component: DetailsComponent,
    canActivate: [DetailsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokemonsRoutingModule {
}
