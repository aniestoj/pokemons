import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsComponent } from './pokemons.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('PokemonsComponent', () => {
  let component: PokemonsComponent;
  let fixture: ComponentFixture<PokemonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PokemonsComponent,
        MockSearchComponent,
        MockListComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when it is initialized', () => {
    it('should show search component', () => {
      expect(search()).toBeTruthy();
    });

    it('should show list component', () => {
      expect(list()).toBeTruthy();
    });
  });

  function search() {
    return fixture.debugElement.query(By.css('app-search'));
  }

  function list() {
    return fixture.debugElement.query(By.css('app-list'));
  }
});

@Component({
  selector: 'app-search',
  template: 'search'
})
class MockSearchComponent {
}

@Component({
  selector: 'app-list',
  template: 'list'
})
class MockListComponent {
}
