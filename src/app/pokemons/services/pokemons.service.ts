import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonsRequest } from '../pokemons.component';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {
  url = '/pokemon/';
  private previousPageUrl: string;
  private nextPageUrl: string;

  constructor(private httpClient: HttpClient) {
  }

  pokemons(): Observable<PokemonsRequest> {
    const params = new HttpParams()
      .append('limit', '10')
      .append('offset', '0');
    return this.httpClient.get<PokemonsRequest>(environment.apiRoot + this.url, { params });
  }

  getNextPage() {

  }
}
