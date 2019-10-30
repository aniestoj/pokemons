import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PokemonsService } from './services/pokemons.service';

export interface PokemonsRequest {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

export interface Pokemon {
  name: string;
  url: string;
}

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonsComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  private previousPage: URL;
  private nextPage: URL;

  constructor(private pokemonService: PokemonsService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.pokemonService.pokemons()
      .subscribe((request) => {
        console.log(request)
        this.pokemonList = request.results;
        if (request.previous) {
          this.previousPage = new URL(request.previous);
        }
        if (request.next) {
          this.nextPage = new URL(request.next);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  previousButtonDisabled() {
    return !this.previousPage;
  }

  nextButtonDisabled() {
    return !this.nextPage || this.nextPage.searchParams.get('offset') >= '100';
  }

  loadPreviousPage() {

  }

  loadNextPage() {

  }
}
