import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

let token: string

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app)).token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to list the history of the check-ins', async () => {
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        latitude: 0,
        longitude: 0,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        { gym_id: gym.id, user_id: user.id },
        { gym_id: gym.id, user_id: user.id },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
      }),
    ])
  })
})
