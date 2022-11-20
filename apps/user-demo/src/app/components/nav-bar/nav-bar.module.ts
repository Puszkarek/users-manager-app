import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconModule } from '@front/components/icon';

import { NavBarComponent } from './nav-bar.component';

@NgModule({
  declarations: [NavBarComponent],
  exports: [NavBarComponent],
  imports: [CommonModule, RouterModule, IconModule],
})
export class NavBarModule {}
