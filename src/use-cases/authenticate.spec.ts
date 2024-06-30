import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let UserRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    UserRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(UserRepository)
  })

  it('should be able to authenticate', async () => {
    await UserRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      passowrd_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await UserRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      passowrd_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
