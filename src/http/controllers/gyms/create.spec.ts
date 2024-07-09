import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

let token: string

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app, true)).token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to create gym', async () => {
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'Gym focusing on JavaScript',
        phone: '(11) 98765-4321',
        latitude: -22.3260708,
        longitude: -46.9274232,
      })

    expect(response.statusCode).toBe(201)
  })
})
