import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'

let CheckInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch User CheckIn history use case', () => {
  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsUseCase(CheckInRepository)
  })

  it('should be able to fetch checkIns in history', async () => {
    await CheckInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await CheckInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user checkIn history', async () => {
    for (let index = 1; index <= 22; index++) {
      await CheckInRepository.create({
        gym_id: `gym-${index}`,
        user_id: `user-${index}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
