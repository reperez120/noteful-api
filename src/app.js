require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, DB_URL } = require('./config')
const notesService = require('./noteful/notes-service')
const foldersService = require('./noteful/folders-service')
const notesRouter = require('./noteful/notes-router')
const foldersRouter = require('./noteful/folders-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny': 'common', {
  skip: () => NODE_ENV === 'test'
}))

app.use(cors())
app.use(helmet())

app.use('/api/notes', notesRouter)
app.use('/api/folders', foldersRouter)

app.get('/', (req, res) => {
req.app.get('db').from('notes').select('*').then(console.log)
  res.send('Hello, world!')
})

// function errorHandler(error, req, res, next) {
//   let response
//   if (process.env.NODE_ENV === 'production') {
//   response = { error: { message: 'server error' } }
//   } else {
//     console.error(error)
//   response = { message: error.message, error }
//   }
//   res.status(500).json(response)
// }
 
module.exports = app