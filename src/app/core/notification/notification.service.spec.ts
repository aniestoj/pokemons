import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationService', () => {
  let toastrService: ToastrService;
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        ToastrService,
        NotificationService
      ]
    });
    toastrService = TestBed.get(ToastrService);
    service = TestBed.get(NotificationService);
    spyOn(toastrService, 'info');
  });

  describe('info method', () => {
    beforeEach(() => {
      service.info('foo', 'bar');
    });

    it('should call toastrService', () => {
      expect(toastrService.info).toHaveBeenCalledWith('foo', 'bar');
    });
  });
});
