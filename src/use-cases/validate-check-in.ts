import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidateError } from './errors/late-check-in-validate-error'

interface ValidateUseCaseRequest {
  checkInId: string
}
interface ValidateUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateUseCaseRequest): Promise<ValidateUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidateError()
    }

    checkIn.validated_at = new Date()

    this.checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
