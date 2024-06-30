import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found'

let UserRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile use case', () => {
  beforeEach(() => {
    UserRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(UserRepository)
  })

  it('should be able to get User Profile', async () => {
    const createdUser = await UserRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      passowrd_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get User Profile with wrong id', async () => {
    expect(
      async () =>
        await sut.execute({
          userId: 'non-exists',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
