import { AuthToken, CreatableUser, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { executeTask, IsPublic } from '@server/app/helpers/controller';
import { REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { IUsersService } from '@server/infra/interfaces/users.interface';
import { Request } from 'express';
import { isEmpty, isUndefined } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: IUsersService) {}

  @Post()
  public async createOne(@Body() creatableUser: CreatableUser): Promise<User> {
    const either = await this._usersService.create.one(creatableUser);

    return executeTask(either);
  }

  @Put()
  public async updateOne(@Body() updatableUser: UpdatableUser): Promise<User> {
    const either = await this._usersService.update.one(updatableUser);

    return executeTask(either);
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string): Promise<void> {
    const either = await this._usersService.delete.one(id);

    executeTask(either);
  }

  // * Login Stuffs
  @Post('login')
  @HttpCode(REQUEST_STATUS.accepted)
  @IsPublic()
  public async loginOne(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const either = await this._usersService.login.one(loginRequest);

    return executeTask(either);
  }

  @Post('token')
  @HttpCode(REQUEST_STATUS.accepted)
  public async refreshOneToken(@Body() authToken: AuthToken): Promise<LoginResponse> {
    const either = await this._usersService.token.refresh(authToken);

    return executeTask(either);
  }

  // * Getters
  @Get('me')
  @HttpCode(REQUEST_STATUS.accepted)
  public async getUserByToken(@Req() request: Request): Promise<User> {
    const authToken = request.header('Authorization')?.split(' ')[1]; // TODO: move to a helper

    // TODO: improve it with a pipe or some guard
    if (isUndefined(authToken) || isEmpty(authToken)) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new HttpException('Missing authentication token', REQUEST_STATUS.unauthorized);
    }

    const either = await this._usersService.get.me(authToken);

    return executeTask(either);
  }

  @Get(':id') // ? (dynamic paths (:id) should be the in the end)
  public async getOne(@Param('id') id: string): Promise<User> {
    const either = await this._usersService.get.one(id);

    return executeTask(either);
  }

  @Get()
  public async getAll(): Promise<ReadonlyArray<User>> {
    const either = await this._usersService.get.all();

    return executeTask(either);
  }
}
