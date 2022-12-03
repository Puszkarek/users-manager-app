import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownTriggerDirective } from './dropdown-trigger.directive';

@NgModule({
  declarations: [DropdownTriggerDirective],
  imports: [CommonModule],
  exports: [DropdownTriggerDirective],
})
export class DropdownTriggerModule {}
