import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '@front/components/header';
import { IconModule } from '@front/components/icon';
import { NavBarModule } from '@front/components/nav-bar';
import { StoreTestingModule } from '@front/stores/root';

import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, StoreTestingModule, IconModule, HeaderModule, NavBarModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});
