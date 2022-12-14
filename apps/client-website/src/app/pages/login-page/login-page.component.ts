import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormEntries } from '@front/app/interfaces/auth';
import { AuthService } from '@front/app/services/auth';
import { NotificationService } from '@front/app/services/notification';
import { toErrorMessage } from '@front/app/utils';
import { foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _notificationService: NotificationService,
  ) {}

  /**
   * Init an action to login the user, then if success redirect him to the main page, otherwise
   * show a notification with the error
   */
  public async loginUser({ email, password }: Readonly<AuthFormEntries>): Promise<void> {
    const tokenEither = await this._authService.login(email, password);

    pipe(
      tokenEither,
      foldW(
        // On Left
        error => {
          this._notificationService.error(toErrorMessage(error));
        },
        // On Right
        async () => {
          await this._router.navigateByUrl('/');
        },
      ),
    );
  }
}
