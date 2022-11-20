import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root';

import { AuthFormComponent } from './auth-form.component';
import { AuthFormModule } from './auth-form.module';

describe(AuthFormComponent.name, () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTestingModule, AuthFormModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
