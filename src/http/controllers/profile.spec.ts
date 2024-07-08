import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

let token: string

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const auth = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    token = auth.body.token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to get user profile', async () => {
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        created_at: expect.any(String),
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    })
  })
})
