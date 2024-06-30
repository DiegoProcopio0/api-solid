import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let CheckInRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(CheckInRepository, gymRepository)

    gymRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkIn in twice in the some day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      sut.execute({
        gymId: 'gym1',
        userId: 'user1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to checkIn in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym1',
      userId: 'user1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkIn on distant gym', async () => {
    gymRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.2787455),
      longitude: new Decimal(-46.9772817),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym1',
        userId: 'user1',
        userLatitude: -22.3260708,
        userLongitude: -46.9274232,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
