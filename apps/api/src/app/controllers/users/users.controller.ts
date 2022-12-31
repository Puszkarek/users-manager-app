import { AuthToken, CreatableUser, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Body, Controller, Delete, Get, Headers, HttpCode, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { executeTaskEither, IsPublic } from '@server/app/helpers/controller';
import { parseRawToken } from '@server/infra/helpers/token';
import { REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { UsersService } from '@server/infra/interfaces/users.interface';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: UsersService) {}

  // * Login Stuffs
  @Post('login')
  @HttpCode(REQUEST_STATUS.ok)
  @IsPublic()
  public async loginOne(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    Logger.log(`Login with email: ${loginRequest.email}`);

    const task = pipe(loginRequest, this._usersService.login.one, executeTaskEither);

    return await task();
  }

  @Post('token')
  @HttpCode(REQUEST_STATUS.accepted)
  public async refreshOneToken(@Body() authToken: AuthToken): Promise<LoginResponse> {
    Logger.log(`Refresh token`);

    const task = pipe(authToken, this._usersService.token.refresh, executeTaskEither);

    return await task();
  }

  // * Crud Operations
  @Post()
  public async createOne(@Body() creatableUser: CreatableUser): Promise<User> {
    Logger.log(`Creating user: ${creatableUser.email}`);

    const task = pipe(creatableUser, this._usersService.create.one, executeTaskEither);

    return await task();
  }

  @Put()
  public async updateOne(@Body() updatableUser: UpdatableUser): Promise<User> {
    Logger.log(`Updating user: ${updatableUser.email}`);

    const task = pipe(updatableUser, this._usersService.update.one, executeTaskEither);
    return await task();
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string, @Headers('authorization') rawToken: AuthToken): Promise<void> {
    Logger.log(`Deleting user: ${id}`);

    const task = pipe(
      // * Parse the raw token
      rawToken,
      parseRawToken,
      TE.fromEither,
      // * Delete the user
      TE.chain(token =>
        this._usersService.delete.one({
          idToDelete: id,
          currentUserToken: token,
        }),
      ),
      executeTaskEither,
    );

    // * Execute the task
    await task();
  }

  // * Getters
  @Get('me')
  @HttpCode(REQUEST_STATUS.accepted)
  public async getUserByToken(@Headers('authorization') rawToken: AuthToken): Promise<User> {
    Logger.log(`Getting user with token`);

    const task = pipe(
      // * Parse the raw token
      rawToken,
      parseRawToken,
      TE.fromEither,
      // * Get the user that belongs to the user
      TE.chain(this._usersService.get.me),
      executeTaskEither,
    );

    return await task();
  }

  @Get(':id') // ? dynamic paths (:id) should be the in the end to not override another path
  public async getOne(@Param('id') id: string): Promise<User> {
    Logger.log(`Getting user with id: ${id}`);

    const task = pipe(id, this._usersService.get.one, executeTaskEither);

    return await task();
  }

  @Get()
  public async getAll(): Promise<ReadonlyArray<User>> {
    Logger.log(`Getting all user`);

    const task = pipe(this._usersService.get.all(), executeTaskEither);
    return await task();
  }
}
