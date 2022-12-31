import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from '@server/app/constants/guard';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { executeTaskEither } from '@server/app/helpers/controller';
import { makeIsRequestAuthenticated } from '@server/infra/guards/auth';
import { UsersService } from '@server/infra/interfaces';
import { Request } from 'express';
import { pipe } from 'fp-ts/lib/function';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _validator = makeIsRequestAuthenticated(this._usersService);

  constructor(
    @Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: UsersService,
    private readonly _reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if is a public route
    const allowRequest = this._reflector.get<boolean | undefined>(PUBLIC_ROUTE_KEY, context.getHandler()) ?? false;
    if (allowRequest) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const task = pipe(request, this._validator, executeTaskEither);

    /** Will throw a `HttpException` if invalid */
    await task();

    return true;
  }
}
