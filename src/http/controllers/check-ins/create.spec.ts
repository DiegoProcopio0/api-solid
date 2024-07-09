import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

let token: string

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app)).token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to create check-in', async () => {
    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        description: 'Gym focusing on JavaScript',
        phone: '(11) 98765-4321',
        latitude: 0,
        longitude: 0,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      })

    expect(response.statusCode).toBe(201)
  })
})
