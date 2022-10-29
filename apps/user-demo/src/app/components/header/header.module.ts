import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@front/components/icon';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, IconModule],
})
export class HeaderModule {}
