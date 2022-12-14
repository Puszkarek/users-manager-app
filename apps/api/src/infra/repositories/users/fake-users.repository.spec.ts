import { User } from '@api-interfaces';
import { UsersRepository } from '@server/infra/interfaces';
import { fromRight, fromSome } from '@server/infra/test/functional';
import { generateUser } from '@testing-utils';
import { isRight } from 'fp-ts/lib/Either';
import { isNone } from 'fp-ts/lib/Option';

import { DEFAULT_USER, DEFAULT_USER_PASSWORD, generateFakeUsersRepository } from './fake-users.repository';

/**
 * If other repository start to be implemented we can abstract and just change update the
 * `beforeEach` since they will follow the same interface
 */
describe(generateFakeUsersRepository.name, () => {
  let repository: UsersRepository;

  beforeEach(() => {
    repository = generateFakeUsersRepository();
  });

  it('should create', () => {
    expect(repository).toBeTruthy();
  });

  it('should have an default user', async () => {
    expect.hasAssertions();

    expect(fromRight(await repository.all()())).toHaveLength(1);
  });

  describe('"Search By" Methods', () => {
    describe('', () => {
      it('should find the user when pass a VALID email', async () => {
        expect.hasAssertions();

        const userO = await repository.findByEmail(DEFAULT_USER.email)();

        const user = fromSome(userO);

        expect(user).toStrictEqual(DEFAULT_USER);
      });

      it('should NOT find the user when pass a INVALID email', async () => {
        expect.hasAssertions();

        const userO = await repository.findByEmail('sauron@lord-of-darkness.com')();

        expect(isNone(userO)).toBe(true);
      });
    });

    describe('findByID', () => {
      it('should find the user when pass a VALID id', async () => {
        expect.hasAssertions();

        const userO = await repository.findByID(DEFAULT_USER.id)();

        const user = fromSome(userO);

        expect(user).toStrictEqual(DEFAULT_USER);
      });

      it('should NOT find the user when pass a INVALID id', async () => {
        expect.hasAssertions();

        const userO = await repository.findByID('waiting-for-my-user')();

        expect(isNone(userO)).toBe(true);
      });
    });
  });

  describe('CRUD Methods', () => {
    describe('save', () => {
      it('should save the new user', async () => {
        expect.hasAssertions();

        // Create a new user
        const bob: User = generateUser({
          name: 'bob',
        });
        const bobPassword = 'really-strong-bob-pass';

        // Validate the initial state before save the new user
        const initialUsers = fromRight(await repository.all()());
        // The new user is NOT listed in the system
        expect(initialUsers).toStrictEqual([DEFAULT_USER]);
        // The new user password is invalid
        await expect(repository.isUserPasswordValid(bob.id, bobPassword)()).resolves.toBe(false);

        // Save the new user
        const updatedE = await repository.save(bob, bobPassword)();
        expect(isRight(updatedE)).toBe(true);

        const allUsers = fromRight(await repository.all()());
        // The new user is listed in the system
        expect(allUsers).toStrictEqual([DEFAULT_USER, bob]);
        // The new user password is valid
        await expect(repository.isUserPasswordValid(bob.id, bobPassword)()).resolves.toBe(true);
      });
    });

    describe('update', () => {
      it('should update the user', async () => {
        expect.hasAssertions();

        const updatedUser: User = { ...DEFAULT_USER, email: 'admin@updated' };

        const updatedE = await repository.update(updatedUser)();
        expect(isRight(updatedE)).toBe(true);

        const updatedUserFromRepository = fromSome(await repository.findByID(updatedUser.id)());

        expect(updatedUserFromRepository).toBe(updatedUser);
      });

      it("should update the user's password with the new one", async () => {
        expect.hasAssertions();

        // First check if the current password is valid
        await expect(repository.isUserPasswordValid(DEFAULT_USER.id, DEFAULT_USER_PASSWORD)()).resolves.toBe(true);

        const UPDATED_PASSWORD = 'new-password';
        // Update the password
        const updatedE = await repository.update(DEFAULT_USER, UPDATED_PASSWORD)();
        expect(isRight(updatedE)).toBe(true);

        // The old password is not valid anymore
        await expect(repository.isUserPasswordValid(DEFAULT_USER.id, DEFAULT_USER_PASSWORD)()).resolves.toBe(false);

        // The new password is valid
        await expect(repository.isUserPasswordValid(DEFAULT_USER.id, UPDATED_PASSWORD)()).resolves.toBe(true);
      });

      it('should NOT update a nonexistent user', async () => {
        expect.hasAssertions();

        const updatedUser: User = { ...DEFAULT_USER, email: 'admin@updated', id: 'nonexistent' };

        // Get all the users in the system
        const initialUsers = fromRight(await repository.all()());

        // Try to update the user
        await repository.update(updatedUser)();

        // Get the current list of user in the system
        const updatedUsers = fromRight(await repository.all()());
        // No changes happens on any user in the system
        expect(initialUsers).toStrictEqual(updatedUsers);
      });
    });

    describe('delete', () => {
      it('should decrease the number of users in the repository when given a VALID id', async () => {
        expect.hasAssertions();

        // Get all the users in the system
        const initialUsers = fromRight(await repository.all()());

        // Delete the default user
        const deleteE = await repository.delete(DEFAULT_USER.id)();
        expect(isRight(deleteE)).toBe(true);

        // Get the current list of user in the system
        const updatedUsers = fromRight(await repository.all()());

        // The system should have only one user less
        expect(updatedUsers.length + 1).toStrictEqual(initialUsers.length);
      });

      // TODO: we need an `should NOT delete himself` test but i think that it should be handler by the `users.service`
      // TODO: same for `should NOT delete when the request comes from a REGULAR user`
      // TODO: and `should delete when the request comes from a ADMINISTRATOR`
    });
  });

  describe('Validation Methods', () => {
    describe('isUserPasswordValid', () => {
      it('should returns TRUE when given a VALID password', async () => {
        expect.hasAssertions();

        const isValid = await repository.isUserPasswordValid(DEFAULT_USER.id, DEFAULT_USER_PASSWORD)();
        expect(isValid).toBe(true);
      });
      it('should returns FALSE when given a INVALID password', async () => {
        expect.hasAssertions();

        const isValid = await repository.isUserPasswordValid(DEFAULT_USER.id, 'dolphin')();
        expect(isValid).toBe(false);
      });
    });
  });
});
