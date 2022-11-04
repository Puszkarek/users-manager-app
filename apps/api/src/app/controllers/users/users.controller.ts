import { CreatableUser, UpdatableUser, User } from '@api-interfaces';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { ExceptionError } from '@server/infra/interfaces';
import { UsersService } from '@server/infra/services';
import { Either, foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

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
}
