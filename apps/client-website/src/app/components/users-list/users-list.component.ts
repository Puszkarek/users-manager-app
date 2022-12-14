import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User, USER_ROLE } from '@api-interfaces';
import { UserFormModalComponent, UserFormModalComponentData } from '@front/app/components/user-form-modal';
import { ModalService } from '@front/app/services/modal';
import { NotificationService } from '@front/app/services/notification';
import { UsersStore } from '@front/app/stores/users';
import { isNotNull } from '@front/app/utils';
import { isLeft } from 'fp-ts/lib/Either';
import { map, Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users-list',
  styleUrls: ['./users-list.component.scss'],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  public readonly users$ = this._usersStore.getAll();

  constructor(
    private readonly _usersStore: UsersStore,
    private readonly _modalService: ModalService,
    private readonly _notificationService: NotificationService,
  ) {}

  /**
   * Open a `Modal` to create a new {@link User} or edit the given one
   *
   * @param user - The user to edit, null if we want to update
   */
  public openForm(user: User | null = null): void {
    const userModalData: UserFormModalComponentData = {
      user: user,
    };

    this._modalService.open(UserFormModalComponent, userModalData);
  }

  /**
   * Starts an action to delete the given user
   *
   * @param user - The user to delete
   */
  public async deleteUser(user: User): Promise<void> {
    // TODO: show a confirmation dialog
    const either = await this._usersStore.delete(user.id);

    if (isLeft(either)) {
      console.error('Error deleting user', either.left);

      this._notificationService.error('Something gone wrong, try again later');
    }
  }

  /**
   * Validate if the user can be deleted by the current user
   *
   * @param user - The user to check if can be deleted
   * @returns True if the `loggedUser` be able to delete
   */
  public canDeleteUser(user: User): Observable<boolean> {
    return this._usersStore.loggedUser$.pipe(
      map(loggedUser => isNotNull(loggedUser) && loggedUser.role === USER_ROLE.admin && loggedUser.id !== user.id),
    );
  }

  /** To be used in `ngFor` to improve the performance */
  public trackByID(_index: number, user: User): string {
    return user.id;
  }
}
