import { TestBed } from '@angular/core/testing';
import { UsersClient } from '@front/app/clients/users';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';
import { UsersStore } from '@front/app/stores/users';
import { generateUser } from '@front/tests/generators/user.generator';
import { right } from 'fp-ts/lib/Either';
import { List } from 'immutable';
import { firstValueFrom } from 'rxjs';

describe(UsersStore.name, () => {
  let store: UsersStore;

  let mockedClient: ReturnType<typeof mockUsersClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    store = TestBed.inject(UsersStore);

    // * Mock the users client
    const usersClient = TestBed.inject(UsersClient);
    mockedClient = mockUsersClient(usersClient);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe(UsersStore.prototype.load.name, () => {
    let loading: boolean | undefined;
    beforeEach(() => {
      store.loading$.subscribe(isLoading => {
        loading = isLoading;
      });
    });

    afterEach(() => {
      loading = undefined;
    });
    it('should UPDATE the state after load', async () => {
      const user = generateUser({});

      // Check the initial state
      expect(loading).toEqual(false);
      expect(await firstValueFrom(store.loaded$)).toEqual(false);
      expect(await firstValueFrom(store.getAll())).toEqual(List([]));

      mockedClient.getAll.mockResolvedValue(right([user]));
      await store.load();

      expect(mockedClient.getAll).toBeCalledTimes(1);

      // Check the updated state
      expect(loading).toEqual(false);
      expect(await firstValueFrom(store.loaded$)).toEqual(true);
      expect(await firstValueFrom(store.getAll())).toEqual(List([user]));

      expect(mockedClient.getAll).toBeCalledTimes(1);
    });

    it('should NOT load the store twice', async () => {
      mockedClient.getAll.mockResolvedValue(right([]));

      // Call load method twice
      await store.load();
      await store.load();

      // Expected to have fetch the data on backend once
      expect(mockedClient.getAll).toBeCalledTimes(1);
    });

    it('should re-load the store when pass', async () => {
      mockedClient.getAll.mockResolvedValue(right([]));

      // Call load
      await store.load();
      // Call load with force
      await store.load({ force: true });

      // Expected to have fetch the data on backend once
      expect(mockedClient.getAll).toBeCalledTimes(2);
    });
  });
});

// TODO: move to some test helpers folder
const mockUsersClient = (client: UsersClient) => {
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
