const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knexConfig = require('../knexfile')
const jsonWebToken = require('jsonwebtoken')
const { hashPassword, checkPassword, ApiError } = require('./utilities')

const ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'

const knex = require('knex')(knexConfig[ENV])

const app = express()

app.use(cors())
app.use(bodyParser.json())

const jwtProtected = (request, response, next) => {
  const header = request.headers.authorization
  if (!header) {
    throw new ApiError('JWT missing', 401)
  }
  const jwt = header.slice(header.indexOf(' ') + 1)
  try {
    const user = jsonWebToken.verify(jwt, JWT_SECRET)
    request.user = user
    next()
  } catch (error) {
    throw new ApiError('Invalid JWT', 401)
  }
}

app.get('/', (request, response) => {
  response.sendStatus(200)
})

// Signup
app.post('/auth/signup', async (request, response) => {
  const { email, password } = request.body
  if (!email || !password || !/\w+@\w+\.\w{2,}/.test(email) || password.length < 6) {
    throw new Error('Missing email/password')
  }
  const hashedPassword = await hashPassword(password)

  const [id] = await knex('users').insert({ email, hashedPassword })
  const user = { id, email }
  const jwt = jsonWebToken.sign(user, JWT_SECRET)
  response.send({ user, jwt })
})

// Signin
app.post('/auth/signin', async (request, response) => {
  const { email, password } = request.body
  if (!email || !password) {
    throw new ApiError('Missing email/password', 400)
  }

  const [dbUser] = await knex('users').select().where({ email })
  if (!dbUser || !await checkPassword(password, dbUser.hashedPassword)) {
    throw new ApiError('Invalid credentials', 401)
  }

  const user = { id: dbUser.id, email }

  const jwt = jsonWebToken.sign(user, JWT_SECRET)
  response.send({ user, jwt })
})

// Create Post
app.post('/posts', jwtProtected, async (request, response) => {
  const { title, content } = request.body

  if (!title || !content) {
    throw new ApiError('Input data missing', 400)
  }

  const postData = {
    userId: request.user.id,
    title,
    content
  }

  const [id] = await knex('posts').insert(postData)
  const [post] = await knex('posts').select('posts.id as id', 'title', 'content', 'posts.created_at as createdAt', 'users.id as userId', 'users.email as userEmail').leftJoin('users', 'users.id', 'posts.userId').where({ 'posts.id': id })
  response.send(post)
})

// Get Posts
app.get('/posts', jwtProtected, async (request, response) => {
  const posts = await knex('posts').select('posts.id as id', 'title', 'content', 'posts.created_at as createdAt', 'users.id as userId', 'users.email as userEmail').leftJoin('users', 'users.id', 'posts.userId')
  response.send(posts)
})

app.use((error, request, response, next) => {
  console.error(`[ERROR] ${error}`)
  if (error instanceof ApiError) {
    response.status(error.status).send({ error: String(error) })
  } else {
    response.status(400).send({ error: 'Request failed' })
  }
})

async function main () {
  await knex.migrate.latest()
  app.listen(PORT, () => {
    console.log(`Server started listening on http://localhost:${PORT}`)
  })
}

main()
