import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownModule } from '@front/app/components/dropdown';
import { IconModule } from '@front/app/components/icon';
import { DropdownTriggerModule } from '@front/app/directives/dropdown-trigger';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, IconModule, DropdownTriggerModule, DropdownModule],
})
export class HeaderModule {}
