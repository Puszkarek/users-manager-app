import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from '@server/app/constants/guard';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { executeTask } from '@server/app/helpers/controller';
import { makeIsRequestAuthenticated } from '@server/infra/guards/auth';
import { IUsersService } from '@server/infra/interfaces';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _validator = makeIsRequestAuthenticated(this._usersService);

  constructor(
    @Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: IUsersService,
    private readonly _reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if is a public route
    const allowRequest = this._reflector.get<boolean | undefined>(PUBLIC_ROUTE_KEY, context.getHandler()) ?? false;
    if (allowRequest) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const either = await this._validator(request);

    /** Will throw a `HttpException` if invalid */
    executeTask(either);

    return true;
  }
}
