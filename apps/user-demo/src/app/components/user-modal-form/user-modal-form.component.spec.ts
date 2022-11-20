import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModalFormModule } from '@front/components/user-modal-form';
import { MODAL_DATA_TOKEN } from '@front/constants/modal';
import { StoreTestingModule } from '@front/stores/root';

import { UserModalFormComponent } from './user-modal-form.component';

describe(UserModalFormComponent.name, () => {
  let component: UserModalFormComponent;
  let fixture: ComponentFixture<UserModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
