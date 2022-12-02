import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListModule } from '@front/app/components/users-list';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { UsersListComponent } from './users-list.component';

describe(UsersListComponent.name, () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTestingModule, OverlayModule, UsersListModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
