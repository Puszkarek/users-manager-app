import { AuthToken, CreatableUser, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { executeEither, IsPublic } from '@server/app/helpers/controller';
import { REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { UsersOperations } from '@server/infra/interfaces/users.interface';
import { Request } from 'express';
import { isEmpty, isUndefined } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE_INJECTABLE_TOKEN) private readonly _usersService: UsersOperations) {}

  // * Login Stuffs
  @Post('login')
  @HttpCode(REQUEST_STATUS.ok)
  @IsPublic()
  public async loginOne(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    Logger.log(`Login with email: ${loginRequest.email}`);

    const either = await this._usersService.login.one(loginRequest);

    return executeEither(either);
  }

  @Post('token')
  @HttpCode(REQUEST_STATUS.accepted)
  public async refreshOneToken(@Body() authToken: AuthToken): Promise<LoginResponse> {
    Logger.log(`Refresh token`);

    const either = await this._usersService.token.refresh(authToken);

    return executeEither(either);
  }

  // * Crud Operations
  @Post()
  public async createOne(@Body() creatableUser: CreatableUser): Promise<User> {
    Logger.log(`Creating user: ${creatableUser.email}`);

    const either = await this._usersService.create.one(creatableUser);

    return executeEither(either);
  }

  @Put()
  public async updateOne(@Body() updatableUser: UpdatableUser): Promise<User> {
    Logger.log(`Updating user: ${updatableUser.email}`);

    const either = await this._usersService.update.one(updatableUser);

    return executeEither(either);
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string, @Headers('authorization') rawToken: AuthToken): Promise<void> {
    Logger.log(`Deleting user: ${id}`);

    // TODO: abstract this
    const [tokenType, authToken] = rawToken.split(' '); // TODO: move to a helper

    // TODO: improve it with a pipe or some guard
    if (isUndefined(authToken) || isEmpty(authToken) || tokenType !== 'Bearer') {
      // eslint-disable-next-line functional/no-throw-statement
      throw new HttpException('Missing authentication token', REQUEST_STATUS.unauthorized);
    }

    const either = await this._usersService.delete.one({
      idToDelete: id,
      currentUserToken: authToken,
    });

    executeEither(either);
  }

  // * Getters
  @Get('me')
  @HttpCode(REQUEST_STATUS.accepted)
  public async getUserByToken(@Req() request: Request): Promise<User> {
    Logger.log(`Getting user with token`);

    const authToken = request.header('Authorization')?.split(' ')[1]; // TODO: move to a helper

    // TODO: improve it with a pipe or some guard
    if (isUndefined(authToken) || isEmpty(authToken)) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new HttpException('Missing authentication token', REQUEST_STATUS.unauthorized);
    }

    const either = await this._usersService.get.me(authToken);

    return executeEither(either);
  }

  @Get(':id') // ? dynamic paths (:id) should be the in the end to not override another path
  public async getOne(@Param('id') id: string): Promise<User> {
    Logger.log(`Getting user with id: ${id}`);

    const either = await this._usersService.get.one(id);

    return executeEither(either);
  }

  @Get()
  public async getAll(): Promise<ReadonlyArray<User>> {
    Logger.log(`Getting all user`);

    const either = await this._usersService.get.all();

    return executeEither(either);
  }
}
