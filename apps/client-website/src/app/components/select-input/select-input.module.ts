import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownModule } from '@front/app/components/dropdown';
import { DropdownTriggerModule } from '@front/app/directives/dropdown-trigger';

import { SelectInputComponent } from './select-input.component';

@NgModule({
  declarations: [SelectInputComponent],
  imports: [CommonModule, DropdownTriggerModule, DropdownModule],
  exports: [SelectInputComponent],
})
export class SelectInputModule {}
