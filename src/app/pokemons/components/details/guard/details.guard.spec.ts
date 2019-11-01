import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailsGuard } from './details.guard';
import { PokemonsService } from '../../../services/pokemons.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/notification/notification.service';
import { MockNotificationService } from '../../../../core/notification/mock-notification.service';

describe('DetailsResolver', () => {
  let guard: DetailsGuard;
  let http: HttpTestingController;
  let expectedUrl: string;
  let router: Router;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        DetailsGuard,
        PokemonsService,
        { provide: NotificationService, useClass: MockNotificationService }
      ]
    });
    guard = TestBed.get(DetailsGuard);
    http = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
    notificationService = TestBed.get(NotificationService);
    environment.apiRoot = 'foobar.com';
    expectedUrl = environment.apiRoot + '/pokemon/123';
    spyOn(router, 'navigate');
    spyOn(notificationService, 'info');
  });

  describe('canActivate method', () => {
    let canActivate: boolean;
    let testRequest: TestRequest;
    let activatedRoute: ActivatedRouteSnapshot;

    beforeEach(() => {
      activatedRoute = new ActivatedRouteSnapshot();
      activatedRoute.params = { id: '123' };
      guard.canActivate(activatedRoute).subscribe(result => canActivate = result);
      testRequest = http.expectOne((request) => request.url === expectedUrl);
    });

    it('should call backend for the details', () => {
      expect(testRequest.request.method).toBe('GET');
    });

    describe('when request is successful', () => {
      beforeEach(() => {
        testRequest.flush({ name: 'foo' });
      });

      it('should save details to the route data', () => {
        expect(activatedRoute.data).toEqual({ name: 'foo' });
      });

      it('should return true', () => {
        expect(canActivate).toBeTruthy();
      });
    });

    describe('when request is not successful', () => {
      beforeEach(fakeAsync(() => {
        testRequest.flush(null, { status: 404, statusText: 'Error' });
      }));

      it('should return false', () => {
        expect(canActivate).toBeFalsy();
      });

      it('should navigate back', () => {
        expect(router.navigate).toHaveBeenCalledWith(['.']);
      });

      it('should call notification service', () => {
        expect(notificationService.info).toHaveBeenCalled();
      });
    });
  });
});
