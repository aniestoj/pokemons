import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonsComponent } from './pokemons.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';

@NgModule({
  declarations: [
    PokemonsComponent,
    PokemonDetailsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PokemonsModule {
}
