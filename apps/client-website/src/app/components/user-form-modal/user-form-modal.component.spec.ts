import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { UserFormModalComponent } from './user-form-modal.component';
import { UserFormModalModule } from './user-form-modal.module';

describe(UserFormModalComponent.name, () => {
  let component: UserFormModalComponent;
  let fixture: ComponentFixture<UserFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormModalComponent],
      imports: [StoreTestingModule, UserFormModalModule],
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: {
            user: null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
