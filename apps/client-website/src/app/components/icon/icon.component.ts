import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-icon',
  styleUrls: ['./icon.component.scss'],
  templateUrl: './icon.component.html',
})
export class IconComponent {}
