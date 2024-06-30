import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserInOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
