import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { UserModalFormComponent } from './user-modal-form.component';
import { UserModalFormModule } from './user-modal-form.module';

describe(UserModalFormComponent.name, () => {
  let component: UserModalFormComponent;
  let fixture: ComponentFixture<UserModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserModalFormComponent],
      imports: [StoreTestingModule, UserModalFormModule],
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: {
            user: null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
