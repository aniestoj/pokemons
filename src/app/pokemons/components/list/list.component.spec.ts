import { DebugElement } from '@angular/core';
import { ListComponent } from './list.component';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { By } from '@angular/platform-browser';
import { PokemonsResponse } from '../../models/pokemons-response';
import { PokemonsService } from '../../services/pokemons.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let http: HttpTestingController;
  let url: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        ListComponent
      ],
      providers: [
        PokemonsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
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
      let mockedRequest: PokemonsResponse;
      beforeEach(() => {
        mockedRequest = mockedResponseFor(0, 10);
        testRequest.flush(mockedRequest);
      });

      it('should show pokemon list', () => {
        expect(pokemonList()).toEqual(namesOf(mockedRequest));
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
          clickOnPreviousButton();
          requests = http.match((request) => request.urlWithParams === mockedRequest.previous);
        });

        it('should not call endpoint for new records', () => {
          expect(requests.length).toEqual(0);
        });
      });

      describe('and user clicks on "next page" button', () => {
        let nextPageTestRequest: TestRequest;

        beforeEach(() => {
          clickOnNextButton();
          nextPageTestRequest = http.expectOne((request) => request.urlWithParams === mockedRequest.next);
        });

        it('should call endpoint for new records', () => {
          expect(nextPageTestRequest.request.method).toBe('GET');
        });

        it('should show disabled pagination buttons', () => {
          expect(textOf(disabledButtons())).toEqual(['Previous', 'Next']);
        });

        describe('and results are returned', () => {
          let mockedNextPageResponse: PokemonsResponse;
          beforeEach(() => {
            mockedNextPageResponse = mockedResponseFor(10, 10);
            nextPageTestRequest.flush(mockedNextPageResponse);
          });

          it('should show a new list', () => {
            expect(pokemonList()).toEqual(namesOf(mockedNextPageResponse));
          });

          it('should show enabled pagination buttons', () => {
            expect(textOf(enabledButtons())).toEqual(['Previous', 'Next']);
          });
        });
      });
    });

    describe('and "10th" page is returned', () => {
      let mockedRequest: PokemonsResponse;

      beforeEach(() => {
        mockedRequest = mockedResponseFor(90, 10);
        testRequest.flush(mockedRequest);
      });

      it('should show enabled "previous page" button', () => {
        expect(textOf(enabledButtons())).toEqual(['Previous']);
      });

      it('should show disabled "next page" button', () => {
        expect(textOf(disabledButtons())).toEqual(['Next']);
      });
    });
  });

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

  function textOf(elements: DebugElement[]) {
    return elements.map(element => element.nativeElement.innerText);
  }

  function pokemonsRequestFor(offset: number, limit: number) {
    return http.expectOne((request) => {
      return request.url === url
        && request.params.get('limit') === limit.toString()
        && request.params.get('offset') === offset.toString();
    });
  }

  function namesOf(request: PokemonsResponse) {
    return request.results.map(result => result.name);
  }

  function mockedResponseFor(offset: number, limit: number) {
    const previousUrl = offset === 0 ? null : `http://www.example.com/foobar?offset=${offset - limit}&limit=${limit}`;
    const nextUrl = `http://www.example.com/foobar?offset=${offset + limit}&limit=${limit}`;
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
      .queryAll(By.css('.list__item'))
      .map((element) => element.nativeElement.innerText);
  }
});
