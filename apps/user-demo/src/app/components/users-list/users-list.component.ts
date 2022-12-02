import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isCreatableUser, User, USER_ROLE } from '@api-interfaces';
import { UserModalFormComponent } from '@front/app/components/user-modal-form';
import { ModalService } from '@front/app/services/modal';
import { UsersStore } from '@front/app/stores/users';
import { isNotNull } from '@front/app/utils';
import { isLeft } from 'fp-ts/lib/Either';
import { firstValueFrom, map, Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users-list',
  styleUrls: ['./users-list.component.scss'],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  public readonly users$ = this._usersStore.getAll();

  constructor(private readonly _usersStore: UsersStore, private readonly _modalService: ModalService) {}

  public trackByID(_index: number, user: User): string {
    return user.id;
  }

  public async openUserForm(user: User | null = null): Promise<void> {
    const reference = this._modalService.openModal(UserModalFormComponent, {
      data: {
        user: user,
      },
    });

    const response = await firstValueFrom(reference.data$);

    if (response) {
      await (isCreatableUser(response) ? this._usersStore.create(response) : this._usersStore.update(response));
    }
  }

  public async deleteUser(user: User): Promise<void> {
    // TODO: show a confirmation dialog
    const either = await this._usersStore.delete(user.id);

    if (isLeft(either)) {
      console.error('Error deleting user', either.left);
    }
  }

  public canDeleteUser(user: User): Observable<boolean> {
    return this._usersStore.loggedUser$.pipe(
      map(loggedUser => isNotNull(loggedUser) && loggedUser.role === USER_ROLE.admin && loggedUser.id !== user.id),
    );
  }
}
