import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { isCreatableUser } from '@front/helpers/user.guard';
import { CreatableUser, UpdatableUser, User } from '@front/interfaces';
import { UsersStore } from '@front/stores';
import { isLeft } from 'fp-ts/lib/Either';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users-list',
  styleUrls: ['./users-list.component.scss'],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  public readonly users$ = this._usersStore.getAll();

  constructor(private readonly _usersStore: UsersStore) {}

  public ngOnInit(): void {
    console.log('init');
  }

  public trackByID(_index: number, user: User): string {
    return user.id;
  }

  public async openUserForm(user: User | null = null): Promise<void> {
    console.log('open modal for user', user);
    const reference: Observable<CreatableUser | UpdatableUser | null> = null!; /*  This._matDialog.open<
      UserModalFormComponent,
      UserModalFormComponentData,
      CreatableUser | UpdatableUser
    >(UserModalFormComponent, {
      data: {
        user: user,
      },
      width: '500px',
    }); */

    const response = await firstValueFrom(reference);

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
