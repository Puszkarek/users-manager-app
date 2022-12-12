import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  // Improve accessibility
  @HostBinding('role') public readonly role = 'listbox';

  // Testing on cypress
  @HostBinding('data-test') public readonly dataTest = 'dropdown-container';
}
