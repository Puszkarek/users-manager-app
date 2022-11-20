import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListModule } from '@front/components/users-list';
import { StoreTestingModule } from '@front/stores/root';

import { UsersListComponent } from './users-list.component';

describe(UsersListComponent.name, () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTestingModule, UsersListModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
