import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let CheckInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(CheckInRepository)
  })

  it('should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym1',
      userId: 'user1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
