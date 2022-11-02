import { CreatableUser, UpdatableUser } from '@api-interfaces';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { REQUEST_STATUS } from '@server/infra/constants';
import { UsersService } from '@server/infra/services';
import { Response } from 'express';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isString } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  public async createOne(@Res() response: Response, @Body() creatableUser: CreatableUser): Promise<void> {
    const either = await this._usersService.create.one(creatableUser);

    pipe(
      either,
      fold(
        // * On error
        error => {
          response.status(REQUEST_STATUS.unauthorized).send(error.message);
        },
        // * On success
        user => {
          response.status(REQUEST_STATUS.ok).send(user);
        },
      ),
    );
  }

  @Put()
  public async updateOne(@Res() response: Response, @Body() updatableUser: UpdatableUser): Promise<void> {
    const either = await this._usersService.update.one(updatableUser);

    pipe(
      either,
      fold(
        // * On error
        error => {
          response.status(REQUEST_STATUS.unauthorized).send(error.message);
        },
        // * On success
        user => {
          response.status(REQUEST_STATUS.ok).send(user);
        },
      ),
    );
  }

  @Delete()
  public async deleteOne(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const either = await this._usersService.delete.one(id);

    pipe(
      either,
      fold(
        // * On error
        error => {
          response.status(REQUEST_STATUS.unauthorized).send(error.message);
        },
        // * On success
        user => {
          response.status(REQUEST_STATUS.ok).send(user);
        },
      ),
    );
  }

  @Get(':id')
  public async getOne(@Param('id') id: string, @Res() response: Response): Promise<void> {
    // TODO: move to pipe below
    if (!isString(id)) {
      // * On wrong data
      response.status(REQUEST_STATUS.bad);
      return;
    }

    const either = await this._usersService.get.one(id);
    pipe(
      either,
      fold(
        // * On error
        error => {
          response.status(REQUEST_STATUS.unauthorized).send(error.message);
        },
        // * On success
        user => {
          response.status(REQUEST_STATUS.ok).send(user);
        },
      ),
    );
  }

  @Get()
  public async getAll(@Res() response: Response): Promise<void> {
    const either = await this._usersService.get.all();

    pipe(
      either,
      fold(
        // * On error
        error => {
          response.status(REQUEST_STATUS.unauthorized).send(error.message);
        },
        // * On success
        users => {
          response.status(REQUEST_STATUS.ok).send(users);
        },
      ),
    );
  }
}
