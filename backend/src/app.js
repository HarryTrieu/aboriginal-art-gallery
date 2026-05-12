import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import artistRoutes from './routes/artistRoutes.js'
import artworkRoutes from './routes/artworkRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

if (process.env.NODE_ENV !== 'test') {
  connectDB()
}

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.NODE_ENV === 'test' ? '*' : 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/artworks', artworkRoutes)
app.use('/api/comments', commentRoutes)

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aboriginal Art Gallery API',
      version: '1.0.0',
      description: 'REST API for the Aboriginal Art Gallery backend',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/api/health', (req, res) => res.json({ status: 'OK' }))

const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

export default app 