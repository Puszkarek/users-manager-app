import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownTriggerDirective } from './dropdown-trigger.directive';

@NgModule({
  declarations: [DropdownTriggerDirective],
  imports: [CommonModule, OverlayModule],
  exports: [DropdownTriggerDirective],
})
export class DropdownTriggerModule {}
