import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PokemonsService } from '../../../services/pokemons.service';
import { catchError, map, tap } from 'rxjs/operators';
import { NotificationService } from '../../../../core/notification/notification.service';

@Injectable()
export class DetailsGuard implements CanActivate {

  constructor(private pokemonsService: PokemonsService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.pokemonsService.details(route.params.id).pipe(
      tap(details => route.data = details),
      map(() => true),
      catchError(() => {
        this.router.navigate(['.']);
        this.notificationService.info(`ID ${route.params.id} does not exist.`, 'Pokemon not found');
        return of(false);
      })
    );
  }
}
