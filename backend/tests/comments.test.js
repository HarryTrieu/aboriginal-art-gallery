import { jest } from '@jest/globals'
import request from 'supertest'
import Artist from '../src/models/Artist.js'
import Artwork from '../src/models/Artwork.js'
import Comment from '../src/models/Comment.js'
import User from '../src/models/User.js'
import { connectTestDB, closeTestDB } from './setup.js'

jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'comment-test-uid',
        email: 'commenter@test.com',
        name: 'Commenter',
        picture: '',
      }),
    }),
  },
  apps: [true],
}))

const { default: app } = await import('../src/app.js')

let testArtworkId
let testCommentId

beforeAll(async () => {
  await connectTestDB()
  const artist = await Artist.create({ name: 'Test Artist' })
  const artwork = await Artwork.create({
    title: 'Test Artwork',
    imageUrl: 'https://example.com/img.jpg',
    artist: artist._id,
  })
  testArtworkId = artwork._id.toString()

  const user = await User.create({
    firebaseUid: 'comment-test-uid',
    email: 'commenter@test.com',
    displayName: 'Commenter',
  })

  const comment = await Comment.create({
    content: 'Beautiful artwork',
    user: user._id,
    artwork: artwork._id,
  })
  testCommentId = comment._id.toString()
})

afterAll(async () => {
  await closeTestDB()
})

describe('GET /api/comments/artwork/:artworkId', () => {
  test('returns 200 and comments array', async () => {
    const res = await request(app).get(`/api/comments/artwork/${testArtworkId}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/comments/artwork/:artworkId', () => {
  test('returns 401 without auth', async () => {
    const res = await request(app)
      .post(`/api/comments/artwork/${testArtworkId}`)
      .send({ content: 'Nice' })
    expect(res.status).toBe(401)
  })

  test('returns 201 with valid auth', async () => {
    const res = await request(app)
      .post(`/api/comments/artwork/${testArtworkId}`)
      .set('Authorization', 'Bearer fake-token')
      .send({ content: 'Great piece' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('content', 'Great piece')
  })
})

describe('DELETE /api/comments/:id', () => {
  test('returns 200 when owner deletes own comment', async () => {
    const res = await request(app)
      .delete(`/api/comments/${testCommentId}`)
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(200)
  })
})