import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseUseCase } from './get-user-metrics'

let CheckInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseUseCase

describe('Get user metrics use case', () => {
  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseUseCase(CheckInRepository)
  })

  it('should be able to get checkIns count from metrics', async () => {
    await CheckInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await CheckInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-02',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
