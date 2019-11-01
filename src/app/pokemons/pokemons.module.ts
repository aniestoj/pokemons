import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonsComponent } from './components/pokemons/pokemons.component';
import { DetailsComponent } from './components/details/details.component';
import { ListComponent } from './components/list/list.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PokemonsRoutingModule } from './pokemons-routing.module';
import { PokemonsService } from './services/pokemons.service';
import { DetailsGuard } from './components/details/guard/details.guard';

@NgModule({
  declarations: [
    PokemonsComponent,
    DetailsComponent,
    ListComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PokemonsRoutingModule
  ],
  providers: [
    PokemonsService,
    DetailsGuard
  ]
})
export class PokemonsModule {
}
