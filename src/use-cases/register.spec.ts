import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(userRepository)
  })

  it('should hash user password registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      user.passowrd_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
