import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@api-interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() public user: User | null = null;

  @Output() public readonly logout = new EventEmitter<void>();

  public logoutUser(): void {
    this.logout.emit();
  }
}
