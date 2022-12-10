import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { DropdownPanel } from '@front/app/interfaces/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements DropdownPanel {
  /** The container that will be rendered the dropdown elements */
  @ViewChild(TemplateRef) public templateRef!: TemplateRef<unknown>;

  /** Emits when we wanna close the dropdown */
  @Output() public readonly closed = new EventEmitter<void>();
}
