import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNewNearbyUseCaseParams {
  userLatitude: number
  userLongitude: number
}

interface FetchNewNearbyUseCaseResponse {
  gyms: Gym[]
}

export class FetchNewNearbyUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNewNearbyUseCaseParams): Promise<FetchNewNearbyUseCaseResponse> {
    const gyms = await this.gymsRepository.findByManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
