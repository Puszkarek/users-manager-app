import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '@front/app/components/header';
import { IconModule } from '@front/app/components/icon';
import { NavBarModule } from '@front/app/components/nav-bar';
import { StoreTestingModule } from '@front/app/stores/root';

import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, OverlayModule, StoreTestingModule, IconModule, HeaderModule, NavBarModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});
