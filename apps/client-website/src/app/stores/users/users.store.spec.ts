import { TestBed } from '@angular/core/testing';
import { CreatableUser, UpdatableUser, User } from '@api-interfaces';
import { UsersClient } from '@front/app/clients/users';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';
import { UsersStore } from '@front/app/stores/users';
import { generateCreatableUser, generateUser } from '@testing-utils';
import { right } from 'fp-ts/lib/Either';
import { List } from 'immutable';
import { firstValueFrom } from 'rxjs';

describe(UsersStore.name, () => {
  let store: UsersStore;

  let mockedClient: ReturnType<typeof createMockedUsersClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    store = TestBed.inject(UsersStore);

    // * Mock the users client
    const usersClient = TestBed.inject(UsersClient);
    mockedClient = createMockedUsersClient(usersClient);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe(UsersStore.prototype.load.name, () => {
    it('should UPDATE the state after load', async () => {
      expect.hasAssertions();

      // Mock the client
      mockedClient.getAll.mockResolvedValue(right([]));

      // Check the initial state
      await expect(firstValueFrom(store.loading$)).resolves.toBe(false);
      await expect(firstValueFrom(store.loaded$)).resolves.toBe(false);

      await store.load();

      // Check the updated state
      await expect(firstValueFrom(store.loading$)).resolves.toBe(false);
      await expect(firstValueFrom(store.loaded$)).resolves.toBe(true);
    });

    it('should NOT update the cache if we call load twice', async () => {
      expect.hasAssertions();

      mockedClient.getAll.mockResolvedValue(right([]));

      // Call load method twice
      await store.load();
      await store.load();

      // Expected to have fetch the data on backend once
      expect(mockedClient.getAll).toHaveBeenCalledTimes(1);
    });

    it('should RELOAD the cache when FORCE load', async () => {
      expect.hasAssertions();

      mockedClient.getAll.mockResolvedValue(right([]));

      // Call load
      await store.load();
      // Call load with force
      await store.load({ force: true });

      // Expected to have fetch the data on backend twice
      expect(mockedClient.getAll).toHaveBeenCalledTimes(2);
    });

    it('should UPDATE the cache with the data from client after load', async () => {
      expect.hasAssertions();

      const { user } = mockedData();

      // Check the initial state
      await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([]));

      mockedClient.getAll.mockResolvedValue(right([user]));
      await store.load();

      expect(mockedClient.getAll).toHaveBeenCalledTimes(1);

      // Check the updated state
      await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([user]));

      expect(mockedClient.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('CRUD Operations', () => {
    describe(UsersStore.prototype.create.name, () => {
      it('should calls the related endpoint', async () => {
        expect.hasAssertions();

        const { creatableUser, user } = mockedData();

        mockedClient.createOne.mockResolvedValue(right(user));
        await store.create(creatableUser);

        expect(mockedClient.createOne).toHaveBeenCalledTimes(1);
      });
    });

    describe(UsersStore.prototype.update.name, () => {
      it('should calls the related endpoint', async () => {
        expect.hasAssertions();

        const { updatableUser, user } = mockedData();

        mockedClient.updateOne.mockResolvedValue(right(user));
        await store.update(updatableUser);

        expect(mockedClient.updateOne).toHaveBeenCalledTimes(1);
      });
    });

    describe(UsersStore.prototype.delete.name, () => {
      it('should calls the related endpoint', async () => {
        expect.hasAssertions();

        const { user } = mockedData();

        mockedClient.deleteOne.mockResolvedValue(right(void 0));
        await store.delete(user.id);

        expect(mockedClient.deleteOne).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Cache Operations', () => {
    describe(UsersStore.prototype.getAll.name, () => {
      it(`should UPDATE the cache when calls ${UsersStore.prototype.create.name}`, async () => {
        expect.hasAssertions();

        // * The initial state is empty
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([]));

        // * Create a new user
        const { user, creatableUser } = mockedData();
        mockedClient.createOne.mockResolvedValue(right(user));
        await store.create(creatableUser);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([user]));
      });

      it(`should UPDATE the cache when calls ${UsersStore.prototype.update.name}`, async () => {
        expect.hasAssertions();

        // * The initial state has one user
        const { user } = mockedData();
        mockedClient.getAll.mockResolvedValue(right([user]));
        await store.load();
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([user]));

        // * Update the current user
        const updatedUser = { ...user, name: 'new-user' };
        mockedClient.updateOne.mockResolvedValue(right(updatedUser));
        await store.update(updatedUser);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([updatedUser]));
      });

      it(`should UPDATE the cache when calls ${UsersStore.prototype.delete.name}`, async () => {
        expect.hasAssertions();

        // * The initial state has one user
        const { user } = mockedData();
        mockedClient.getAll.mockResolvedValue(right([user]));
        await store.load();
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([user]));

        // * Delete the current user
        mockedClient.deleteOne.mockResolvedValue(right(void 0));
        await store.delete(user.id);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getAll())).resolves.toStrictEqual(List([]));
      });
    });

    describe(UsersStore.prototype.getOne.name, () => {
      it(`should UPDATE the cache when calls ${UsersStore.prototype.create.name}`, async () => {
        expect.hasAssertions();

        const { user, creatableUser } = mockedData();
        // * The initial state is empty
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toBeNull();

        // * Create a new user
        mockedClient.createOne.mockResolvedValue(right(user));
        await store.create(creatableUser);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toStrictEqual(user);
      });

      it(`should UPDATE the cache when calls ${UsersStore.prototype.update.name}`, async () => {
        expect.hasAssertions();

        const { user } = mockedData();
        // * The initial state has one user
        mockedClient.getAll.mockResolvedValue(right([user]));
        await store.load();
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toStrictEqual(user);

        // * Update the current user
        const updatedUser = { ...user, name: 'new-user' };
        mockedClient.updateOne.mockResolvedValue(right(updatedUser));
        await store.update(updatedUser);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toStrictEqual(updatedUser);
      });

      it(`should UPDATE the cache when calls ${UsersStore.prototype.delete.name}`, async () => {
        expect.hasAssertions();

        const { user } = mockedData();
        // * The initial state has one user
        mockedClient.getAll.mockResolvedValue(right([user]));
        await store.load();
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toStrictEqual(user);

        // * Delete the current user
        mockedClient.deleteOne.mockResolvedValue(right(void 0));
        await store.delete(user.id);

        // * The cache is updated with the new user
        await expect(firstValueFrom(store.getOne(user.id))).resolves.toBeNull();
      });
    });
  });
});

// TODO: move to some test helpers folder
const createMockedUsersClient = (client: UsersClient) => {
  return {
    updateOne: jest.spyOn(client, 'updateOne'),
    createOne: jest.spyOn(client, 'createOne'),
    deleteOne: jest.spyOn(client, 'deleteOne'),
    getAll: jest.spyOn(client, 'getAll'),
    getOne: jest.spyOn(client, 'getOne'),
    loginOne: jest.spyOn(client, 'loginOne'),
    getMe: jest.spyOn(client, 'getMe'),
    logoutOne: jest.spyOn(client, 'logoutOne'),
  };
};

// TODO: improve this interface
const mockedData = (): {
  user: User;
  updatableUser: UpdatableUser;
  creatableUser: CreatableUser;
} => {
  const _user = generateUser({
    id: 'fake-id',
  });

  const _creatableUser: CreatableUser = generateCreatableUser({});

  const _updatableUser: UpdatableUser = {
    ..._user,
    name: 'updated-username',
  };
  return {
    user: _user,
    updatableUser: _updatableUser,
    creatableUser: _creatableUser,
  };
};
