import { CreatableUser, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Inject, Param, Post, Put } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { ExceptionError } from '@server/infra/interfaces';
import { REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { IUsersService } from '@server/infra/interfaces/users.interface';
import { Either, foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

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

  // * Login Stuffs
  @Post('login')
  @HttpCode(REQUEST_STATUS.accepted)
  public async loginOne(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const either = await this._usersService.login.one(loginRequest);

    return this._executeTask(either);
  }
}
