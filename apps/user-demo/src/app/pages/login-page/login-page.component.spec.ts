import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { LoginPageComponent } from './login-page.component';
import { LoginPageModule } from './login-page.module';

describe(LoginPageComponent.name, () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTestingModule, LoginPageModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
