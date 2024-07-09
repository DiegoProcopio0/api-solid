import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

let token: string

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app, true)).token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to validate a check-in', async () => {
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        description: 'Gym focusing on JavaScript',
        phone: '(11) 98765-4321',
        latitude: 0,
        longitude: 0,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: { gym_id: gym.id, user_id: user.id },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: { id: checkIn.id },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
