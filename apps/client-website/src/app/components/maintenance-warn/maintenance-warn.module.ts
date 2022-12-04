import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaintenanceWarnComponent } from './maintenance-warn.component';

@NgModule({
  declarations: [MaintenanceWarnComponent],
  exports: [MaintenanceWarnComponent],
  imports: [CommonModule],
})
export class MaintenanceWarnModule {}
