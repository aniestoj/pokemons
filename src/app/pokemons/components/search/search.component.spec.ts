import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
          { path: ':id', component: DummyComponent }
        ]),
        ReactiveFormsModule
      ],
      declarations: [
        SearchComponent,
        DummyComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
  });

  describe('when component is initialized', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show a search input', () => {
      expect(searchInput()).toBeDefined();
    });

    it('should show a disabled search button', () => {
      expect(searchButton().classList).toContain('button--disabled');
    });

    it('should hide an input error message', () => {
      expect(searchInputError()).toBeNull();
    });

    describe('and user types number in the search input', () => {
      beforeEach(() => {
        searchInput().value = '123';
        searchInput().dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should show an enabled search button', () => {
        expect(searchButton().classList).not.toContain('button--disabled');
      });

      describe('and user clicks on the button', () => {
        beforeEach(fakeAsync(() => {
          searchButton().click();
        }));

        it('should redirect to the details page', () => {
          expect(location.path()).toBe('/123');
        });
      });
    });

    describe('and user types not a number in the search input', () => {
      beforeEach(() => {
        searchInput().value = 'foobar';
        searchInput().dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should show an disabled search button', () => {
        expect(searchButton().classList).toContain('button--disabled');
      });

      it('should show an input error message', () => {
        expect(searchInputError().nativeElement.innerText).toContain('Incorrect value, please enter numeric ID.');
      });

      describe('and user clicks on the button', () => {
        beforeEach(fakeAsync(() => {
          searchButton().click();
        }));

        it('should not redirect to the details page', () => {
          expect(location.path()).toBe('');
        });
      });
    });

    describe('and user types "0" in the search input', () => {
      beforeEach(() => {
        searchInput().value = 'foobar';
        searchInput().dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });

      it('should show an disabled search button', () => {
        expect(searchButton().classList).toContain('button--disabled');
      });

      it('should show an input error message', () => {
        expect(searchInputError().nativeElement.innerText).toContain('Incorrect value, please enter numeric ID.');
      });
    });

    describe('and user clicks on the button', () => {
      beforeEach(fakeAsync(() => {
        searchButton().click();
      }));

      it('should not redirect to the details page', () => {
        expect(location.path()).toBe('');
      });
    });
  });

  function searchButton() {
    return fixture.debugElement.query(By.css('.button')).nativeElement;
  }

  function searchInput() {
    return fixture.debugElement.query(By.css('.search__input')).nativeElement;
  }

  function searchInputError() {
    return fixture.debugElement.query(By.css('.search__input__error'));
  }
});

@Component({
  template: ''
})
class DummyComponent {
}
