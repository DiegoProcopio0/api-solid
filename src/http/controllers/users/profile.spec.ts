import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

let token: string

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app)).token
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
        role: 'MEMBER',
        email: 'john.doe@example.com',
      },
    })
  })
})
