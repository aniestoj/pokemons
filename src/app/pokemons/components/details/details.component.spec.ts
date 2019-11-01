import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { PokemonDetails, Stat } from '../../models/pokemon-details';
import { Subject } from 'rxjs';
import Spy = jasmine.Spy;

describe('PokemonDetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let routerSpy: Spy;
  let details$: Subject<PokemonDetails>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        DetailsComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);
    routerSpy = spyOn(router, 'navigate');

    details$ = new Subject<PokemonDetails>();
    activatedRoute.data = details$;
    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    describe('and activated route emits data', () => {
      let details: PokemonDetails;
      beforeEach(() => {
        details = mockedDetails(123);
        details$.next(details);
      });

      it('should show pokemon name', () => {
        expect(name()).toEqual(details.name);
      });

      it('should show image', () => {
        expect(image()).toEqual('http://www.url.com/foobar');
      });

      it('should show stats', () => {
        expect(stats()).toEqual(format(details.stats));
      });
    });

    describe('and id of the pokemon is equal or less than "1"', () => {
      let details: PokemonDetails;
      beforeEach(() => {
        details = mockedDetails(1);
        details$.next(details);
      });

      it('should show disabled previous button', () => {
        expect(textOf(disabledButtons())).toEqual(['Previous']);
      });

      it('should enabled next button', () => {
        expect(textOf(enabledButtons())).toEqual(['Next']);
      });
    });

    describe('and id of the pokemon is greater than "1"', () => {
      let details: PokemonDetails;
      beforeEach(() => {
        details = mockedDetails(123);
        details$.next(details);
      });

      it('should enabled "next" and "previous" button', () => {
        expect(textOf(enabledButtons())).toEqual(['Previous', 'Next']);
      });

      describe('and user clicks on "previous" button', () => {
        beforeEach(() => {
          clickOnPreviousButton();
        });

        it('should redirect to the previous page', () => {
          expect(router.navigate).toHaveBeenCalledWith([details.id - 1]);
        });
      });

      describe('and user clicks on "next" button', () => {
        beforeEach(() => {
          clickOnNextButton();
        });

        it('should redirect to the next page', () => {
          expect(router.navigate).toHaveBeenCalledWith([details.id + 1]);
        });
      });
    });

    describe('and component is destroyed', () => {
      beforeEach(() => {
        component.ngOnDestroy();
      });

      describe('and data emits new details', () => {
        let details: PokemonDetails;
        beforeEach(() => {
          details = mockedDetails(321);
          details$.next(details);
        });

        it('should not update the view', () => {
          expect(name()).not.toEqual(details.name);
        });
      });
    });
  });

  function format(statList: Stat[]) {
    return statList.map(stat => {
      return [
        stat.base_stat.toString(),
        stat.effort.toString(),
        stat.stat.name
      ];
    });
  }

  function stats() {
    return fixture.debugElement.queryAll(By.css('.stat'))
      .map((element) => {
        return [baseStat(element), statEffort(element), statName(element)];
      });
  }

  function baseStat(element: DebugElement) {
    return element.query(By.css('.stat__base-stat')).nativeElement.innerText;
  }

  function statEffort(element: DebugElement) {
    return element.query(By.css('.stat__effort')).nativeElement.innerText;
  }

  function statName(element: DebugElement) {
    return element.query(By.css('.stat__name')).nativeElement.innerText;
  }

  function image() {
    return fixture.debugElement.query(By.css('.pokemon__image')).nativeElement.src;
  }

  function name() {
    return fixture.debugElement.query(By.css('.pokemon__name')).nativeElement.innerText.toLowerCase();
  }

  function mockedDetails(id: number) {
    return {
      id,
      name: 'foo_' + id,
      stats: [
        mockedStat(),
        mockedStat(),
        mockedStat()
      ],
      sprites: {
        front_default: 'http://www.url.com/foobar'
      }
    };
  }

  function mockedStat() {
    const randomNumber = Math.round(Math.random() * 100 + 1);
    return {
      base_stat: randomNumber,
      effort: randomNumber + 10,
      stat: {
        name: 'foo_' + randomNumber,
        url: 'http://www.url.com/' + randomNumber
      }
    };
  }

  function enabledButtons() {
    return fixture
      .debugElement
      .queryAll(By.css('.button')).filter(element => !element.nativeElement.classList.contains('button--disabled'));
  }

  function disabledButtons() {
    return fixture
      .debugElement
      .queryAll(By.css('.button--disabled'));
  }

  function textOf(elements: DebugElement[]) {
    return elements.map(element => element.nativeElement.innerText);
  }

  function clickOnNextButton() {
    return fixture
      .debugElement
      .query(By.css('.button__next'))
      .nativeElement
      .click();
  }

  function clickOnPreviousButton() {
    return fixture
      .debugElement
      .query(By.css('.button__previous'))
      .nativeElement
      .click();
  }
});

class MockActivatedRoute {
  data = {};
}
