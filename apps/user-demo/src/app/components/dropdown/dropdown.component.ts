import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { IDropdownComponent } from '@front/app/interfaces/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements IDropdownComponent {
  @ViewChild(TemplateRef) public templateRef!: TemplateRef<unknown>;
  @Output() public readonly closed = new EventEmitter<void>();
}
