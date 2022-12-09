import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPanel } from './dropdown.component';

describe(DropdownComponent.name, () => {
  let component: DropdownPanel;
  let fixture: ComponentFixture<DropdownPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
