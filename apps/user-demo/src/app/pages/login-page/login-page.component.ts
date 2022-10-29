import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { isLeft } from 'fp-ts/lib/Either';
import { AuthFormEntries } from '@front/interfaces';
import { AuthService } from '@front/services/auth';
import { NotificationService } from '@front/services/notification';
import { toErrorMessage } from '@front/utils';

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
    private readonly _notificationService: NotificationService
  ) {}

  public async loginUser({
    email,
    password,
  }: Readonly<AuthFormEntries>): Promise<void> {
    const tokenEither = await this._authService.login(email, password);

    if (isLeft(tokenEither)) {
      this._notificationService.error(toErrorMessage(tokenEither.left));
      return void 0;
    }

    await this._router.navigate(['/']);
    return void 0;
  }
}
