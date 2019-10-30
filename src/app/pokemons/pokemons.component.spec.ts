import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsComponent, PokemonsRequest } from './pokemons.component';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { DebugElement } from '@angular/core';

describe('PokemonsComponent', () => {
  let component: PokemonsComponent;
  let fixture: ComponentFixture<PokemonsComponent>;
  let http: HttpTestingController;
  let url: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        PokemonsComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpTestingController);
    environment.apiRoot = 'www.example.com';
    url = environment.apiRoot + '/pokemon/';

    fixture.detectChanges();
  });

  describe('when component is initialized', () => {
    let testRequest: TestRequest;
    beforeEach(() => {
      testRequest = pokemonsRequestFor(0, 10);
    });

    it('should show skeleton loader', () => {
      expect(skeleton()).toBeTruthy();
    });

    it('should not show pokemon list', () => {
      expect(pokemonList()).toEqual([]);
    });

    it('should call endpoint for pokemon list', () => {
      expect(testRequest.request.method).toBe('GET');
    });

    it('should show disabled pagination buttons', () => {
      expect(textOf(disabledButtons())).toEqual(['Previous', 'Next']);
    });

    describe('and results are returned', () => {
      let mockedRequest: PokemonsRequest;
      beforeEach(() => {
        mockedRequest = mockedRequestFor(0, 10);
        testRequest.flush(mockedRequest);
      });

      it('should show pokemon list', () => {
        expect(pokemonList()).toEqual(namesOf(mockedRequest));
      });

      it('should hide skeleton loader', () => {
        expect(skeleton()).toBeNull();
      });

      it('should show disabled "previous page" button', () => {
        expect(textOf(disabledButtons())).toEqual(['Previous']);
      });

      it('should show enabled "next page" button', () => {
        expect(textOf(enabledButtons())).toEqual(['Next']);
      });

      describe('and user clicks on "previous page" button', () => {
        let requests: TestRequest[];

        beforeEach(() => {
          requests = http.match((request) => request.url === url);
        });

        it('should not call endpoint for new records', () => {
          expect(requests.length).toEqual(0);
        });
      });

      describe('and user clicks on "next page" button', () => {
        let nextPageRequest: TestRequest;

        beforeEach(() => {
          nextPageRequest = pokemonsRequestFor(10, 10);
        });

        it('should call endpoint for new records', () => {
          expect(nextPageRequest.request.method).toBe('GET');
        });

        it('should show skeleton loader', () => {

        });

        it('should show disabled pagination buttons', () => {

        });

        describe('and results are returned', () => {
          beforeEach(() => {

          });

          it('should show pokemon list', () => {

          });

          it('should show enabled pagination buttons', () => {

          });
        });
      });
    });

    describe('and "10th" page is returned', () => {
      let mockedRequest: PokemonsRequest;

      beforeEach(() => {
        mockedRequest = mockedRequestFor(90, 10);
        testRequest.flush(mockedRequest);
      });

      it('should show disabled "previous page" button', () => {
        expect(textOf(disabledButtons())).toEqual(['Next']);
      });

      it('should show disabled "next page" button', () => {
        expect(textOf(enabledButtons())).toEqual(['Previous']);
      });
    });

    describe('and request fails', () => {
      beforeEach(() => {

      });

      it('should not show skeleton loader', () => {

      });

      it('should not show pokemon list', () => {

      });

      it('should show error message', () => {

      });

      it('should show disabled pagination buttons', () => {

      });
    });
  });

  function enabledButtons() {
    return fixture
      .debugElement
      .queryAll(By.css('.pagination__button'))
      .filter(element => !element.nativeElement.classList.contains('pagination__button--disabled'));
  }

  function textOf(elements: DebugElement[]) {
    return elements.map(element => element.nativeElement.innerText);
  }

  function disabledButtons() {
    return fixture
      .debugElement
      .queryAll(By.css('.pagination__button--disabled'));
  }

  function pokemonsRequestFor(offset: number, limit: number) {
    return http.expectOne((request) => {
      return request.url === url
        && request.params.get('limit') === limit.toString()
        && request.params.get('offset') === offset.toString();
    });
  }

  function namesOf(request: PokemonsRequest) {
    return request.results.map(result => result.name);
  }

  function mockedRequestFor(offset: number, limit: number) {
    const previousUrl = offset === 0 ? null : `http://www.example.com/foobar?offset=${offset - limit}&limit=${limit}`;
    const nextUrl = `http://www.example.com/foobar?offset=${offset + limit}&limit=${limit}`;
    console.log(previousUrl);
    console.log(nextUrl);

    return {
      count: 123,
      previous: previousUrl,
      next: nextUrl,
      results: requestResults(offset, limit)
    };
  }

  function requestResults(offset: number, limit: number) {
    const results = [];
    for (let i = offset; i < limit; i++) {
      results.push({ name: 'foobar_' + i, url: 'http://www.example.com/foobar/' + i });
    }
    return results;
  }

  function pokemonList(): string[] {
    return fixture.debugElement
      .queryAll(By.css('.pokemon__list__item'))
      .map((element) => element.nativeElement.innerText);
  }

  function skeleton(): DebugElement {
    return fixture.debugElement.query(By.css('.pokemon__skeleton'));
  }
});
