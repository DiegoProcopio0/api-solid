import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInRepository {
  findByUserInOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}