import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

let token: string

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    token = (await createAndAuthenticateUser(app, true)).token
  })

  afterAll(async () => {
    await app.close()
  })
  it('should ne able to list nearby gyms', async () => {
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'Gym focusing on JavaScript',
        phone: '(11) 98765-4321',
        latitude: -22.3260708,
        longitude: -46.9274232,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS Gym',
        description: 'Gym focusing on TypeScript',
        phone: '(11) 98765-4321',
        latitude: -22.9215586,
        longitude: -43.4694228,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -22.3260708,
        longitude: -46.9274232,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym' }),
    ])
  })
})
