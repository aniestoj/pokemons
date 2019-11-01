import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonsResponse } from '../models/pokemons-response';
import { PokemonDetails } from '../models/pokemon-details';

@Injectable()
export class PokemonsService {
  private readonly url = '/pokemon/';

  constructor(private httpClient: HttpClient) {
  }

  resultsFrom(url: string): Observable<PokemonsResponse> {
    return this.httpClient.get<PokemonsResponse>(url);
  }

  firstPage(): Observable<PokemonsResponse> {
    return this.httpClient.get<PokemonsResponse>(
      environment.apiRoot + this.url,
      { params: this.initialParams() }
    );
  }

  details(id: number): Observable<PokemonDetails> {
    return this.httpClient.get<PokemonDetails>(environment.apiRoot + this.url + id);
  }

  private initialParams(): HttpParams {
    return new HttpParams()
      .append('limit', '10')
      .append('offset', '0');
  }
}
