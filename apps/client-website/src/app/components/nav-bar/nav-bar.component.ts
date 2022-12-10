import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersStore } from '@front/app/stores/users';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nav-bar',
  styleUrls: ['./nav-bar.component.scss'],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  /** Emits true if the user is an admin, otherwise emits false */
  public readonly isAdmin$ = this._usersStore.isLoggedUserAdmin$;

  constructor(private readonly _usersStore: UsersStore) {}
}
