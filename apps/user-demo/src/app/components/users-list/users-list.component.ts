import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isCreatableUser, User } from '@api-interfaces';
import { UserModalFormComponent } from '@front/components/user-modal-form';
import { ModalService } from '@front/services/modal';
import { UsersStore } from '@front/stores';
import { isLeft } from 'fp-ts/lib/Either';
import { firstValueFrom } from 'rxjs';

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
}
