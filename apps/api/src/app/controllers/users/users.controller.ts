import { CreatableUser, LoginRequest, LoginResponse, UpdatableUser, User, UserToken } from '@api-interfaces';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { IUsersService } from '@server/infra/interfaces/users.interface';
import { Request } from 'express';
import { Either, foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isUndefined } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: IUsersService) {}

  // TODO: move to a helper to be available for other services in the future
  private _executeTask<T>(either: Either<ExceptionError, T>): T {
    return pipe(
      either,
      foldW(
        // * On error
        error => {
          // eslint-disable-next-line functional/no-throw-statement
          throw new HttpException(error.message, error.statusCode);
        },
        // * On success
        user => {
          return user;
        },
      ),
    );
  }

  @Post()
  public async createOne(@Body() creatableUser: CreatableUser): Promise<User> {
    const either = await this._usersService.create.one(creatableUser);

    return this._executeTask(either);
  }

  @Put()
  public async updateOne(@Body() updatableUser: UpdatableUser): Promise<User> {
    const either = await this._usersService.update.one(updatableUser);

    return this._executeTask(either);
  }

  @Delete()
  public async deleteOne(@Param('id') id: string): Promise<void> {
    const either = await this._usersService.delete.one(id);

    this._executeTask(either);
  }

  // * Login Stuffs
  @Post('login')
  @HttpCode(REQUEST_STATUS.accepted)
  public async loginOne(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const either = await this._usersService.login.one(loginRequest);

    return this._executeTask(either);
  }

  @Post('token')
  @HttpCode(REQUEST_STATUS.accepted)
  public async refreshOneToken(@Body() userToken: UserToken): Promise<LoginResponse> {
    const either = await this._usersService.token.refresh(userToken);

    return this._executeTask(either);
  }

  @Get('me')
  @HttpCode(REQUEST_STATUS.accepted)
  public async getUserByToken(@Req() request: Request): Promise<User> {
    const userToken = request.header('Authorization');

    // TODO: improve it with a pipe or some guard
    if (isUndefined(userToken)) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new HttpException('Missing authentication token', REQUEST_STATUS.unauthorized);
    }

    const either = await this._usersService.get.me(userToken);

    return this._executeTask(either);
  }

  // * Getters (dynamic paths (:id) should be the in the end)
  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<User> {
    const either = await this._usersService.get.one(id);

    return this._executeTask(either);
  }

  @Get()
  public async getAll(): Promise<ReadonlyArray<User>> {
    const either = await this._usersService.get.all();

    return this._executeTask(either);
  }
}
