require('dotenv').config()
const knex = require('knex')
const app = require('./app')
const { PORT, DB_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL
})

app.set('db', db)

db('folders')
  .join('notes', 'folders.id', '=', 'notes.folder')
  .select('*').then(console.log)


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})