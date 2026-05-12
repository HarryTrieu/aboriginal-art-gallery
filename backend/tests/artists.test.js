import { jest } from '@jest/globals'
import mongoose from 'mongoose'
import request from 'supertest'
import Artist from '../src/models/Artist.js'
import { connectTestDB, closeTestDB } from './setup.js'

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'test-uid-123',
        email: 'test@test.com',
        name: 'Test User',
        picture: '',
      }),
    }),
  },
  apps: [true],
}))

const { default: app } = await import('../src/app.js')

let testArtistId

beforeAll(async () => {
  await connectTestDB()
  const artist = await Artist.create({
    name: 'Emily Kame Kngwarreye',
    tribe: 'Anmatyerre',
    region: 'Central Australia',
  })
  testArtistId = artist._id.toString()
})

afterAll(async () => {
  await closeTestDB()
})

describe('GET /api/artists', () => {
  test('returns 200 and an array of artists', async () => {
    const res = await request(app).get('/api/artists')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artists')
    expect(Array.isArray(res.body.artists)).toBe(true)
  })
})

describe('GET /api/artists/:id', () => {
  test('returns 200 with artist and artworks array', async () => {
    const res = await request(app).get(`/api/artists/${testArtistId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artist')
    expect(res.body).toHaveProperty('artworks')
  })

  test('returns 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app).get(`/api/artists/${fakeId}`)
    expect(res.status).toBe(404)
  })
})

describe('POST /api/artists', () => {
  test('returns 401 without a token', async () => {
    const res = await request(app).post('/api/artists').send({ name: 'Test' })
    expect(res.status).toBe(401)
  })

  test('returns 403 when user is not admin', async () => {
    const res = await request(app)
      .post('/api/artists')
      .set('Authorization', 'Bearer fake-token')
      .send({ name: 'Test Artist' })
    expect(res.status).toBe(403)
  })
})