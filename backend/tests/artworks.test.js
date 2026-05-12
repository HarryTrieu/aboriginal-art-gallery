import { jest } from '@jest/globals'
import mongoose from 'mongoose'
import request from 'supertest'
import Artist from '../src/models/Artist.js'
import Artwork from '../src/models/Artwork.js'
import { connectTestDB, closeTestDB } from './setup.js'

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'test-uid-456',
        email: 'test2@test.com',
        name: 'Test User 2',
        picture: '',
      }),
    }),
  },
  apps: [true],
}))

const { default: app } = await import('../src/app.js')

let testArtworkId

beforeAll(async () => {
  await connectTestDB()
  const artist = await Artist.create({ name: 'Albert Namatjira', tribe: 'Arrernte' })
  const artwork = await Artwork.create({
    title: 'Ghost Gum Tree',
    imageUrl: 'https://example.com/image.jpg',
    artist: artist._id,
  })
  testArtworkId = artwork._id.toString()
})

afterAll(async () => {
  await closeTestDB()
})

describe('GET /api/artworks', () => {
  test('returns 200 and paginated data', async () => {
    const res = await request(app).get('/api/artworks')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artworks')
    expect(res.body).toHaveProperty('total')
  })
})

describe('GET /api/artworks/:id', () => {
  test('returns 200 with artist populated', async () => {
    const res = await request(app).get(`/api/artworks/${testArtworkId}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artist')
    expect(res.body.artist).toHaveProperty('name')
  })
})

describe('POST /api/artworks', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).post('/api/artworks').send({ title: 'Test' })
    expect(res.status).toBe(401)
  })
})