import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInRepository {
  public items: CheckIn[] = []

  async findByUserInOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSomeDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSomeDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return (checkIn.user_id = userId) && isOnSomeDate
    })

    if (!checkInOnSomeDate) {
      return null
    }

    return checkInOnSomeDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const CheckIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(CheckIn)

    return CheckIn
  }
}
