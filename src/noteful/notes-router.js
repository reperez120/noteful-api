const express = require('express')
const notesService = require('./notes-service')
const path = require('path')
const notesRouter = express.Router()
const bodyParser = express.json()

const serializeNote = note => ({
  name: note.note_name,
  content: note.content,
  folder: note.folder,
  date: note.date_modified,
  id: note.id
})

notesRouter
  .route('/')

  .get((req, res, next) => {
    notesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const { name, content, folder, date } = req.body
    const newNote = { name, content, folder, date }
    console.log(newNote)

    for (const field of [ 'name', 'content']) {
      if (!req.body[field]) {
        console.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    notesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        console.log(note)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')

  .all((req, res, next) => {
    const { note_id } = req.params
    notesService.getById(req.app.get('db'), note_id)
      .then(note => {
        if (!note) {
          console.error(`note with id ${note_id} not found.`)
          return res.status(404).json({
            error: { message: `note Not Found` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })

  .get((req, res) => {
    res.json(serializeNote(res.note))
  })

  .delete((req, res, next) => {
    const { note_id } = req.params
    notesService.deleteNote(
      req.app.get('db'),
      note_id
    )
    .then(numRowsAffected => {
      console.info(`Note with id ${note_id} deleted.`)
      res.status(204).end()
    })
    .catch(next)
  })

  .patch(bodyParser, (req, res, next) => {
    const { id, name, content } = req.body
    const noteToUpdate = { name, content, folder, date, id }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      console.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', and 'folder'`
        }
      })
    }

    notesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter
