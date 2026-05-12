import mongoose from 'mongoose'

const MONGO_TEST_URI = 'mongodb://localhost:27017/aboriginal_art_gallery_test'

export const connectTestDB = async () => {
  await mongoose.connect(MONGO_TEST_URI)
}

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}