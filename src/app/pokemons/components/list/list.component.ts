import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PokemonsService } from '../../services/pokemons.service';
import { PokemonsResponse } from '../../models/pokemons-response';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  pokemonsResponse: PokemonsResponse;
  previousDisabled = true;
  nextDisabled = true;

  constructor(private pokemonService: PokemonsService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadFirstPage();
  }

  loadPreviousPage() {
    this.reset();
    this.pokemonService
      .resultsFrom(this.pokemonsResponse.previous)
      .subscribe((response: PokemonsResponse) => this.save(response));
  }

  loadNextPage() {
    this.reset();
    this.pokemonService
      .resultsFrom(this.pokemonsResponse.next)
      .subscribe((response: PokemonsResponse) => this.save(response));
  }

  private reset() {
    this.nextDisabled = true;
    this.previousDisabled = true;
    this.changeDetectorRef.detectChanges();
  }

  private save(response: PokemonsResponse) {
    this.pokemonsResponse = response;
    this.previousDisabled = !response.previous;
    this.nextDisabled = !response.next || this.offsetParamFrom(response.next) >= 100;
    this.changeDetectorRef.detectChanges();
  }

  private offsetParamFrom(url: string): number {
    const param = new URL(url).searchParams.get('offset');
    return +param;
  }

  private loadFirstPage() {
    this.pokemonService
      .firstPage()
      .subscribe((response: PokemonsResponse) => this.save(response));
  }
}
