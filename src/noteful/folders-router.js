const express = require('express')
const foldersService = require('./folders-service')
const path = require('path')
const foldersRouter = express.Router()
const bodyParser = express.json()

const serializeFolder = folder => ({
  id: folder.id,
  name: folder.folder_name,
  contents: folder.contents
})

foldersRouter
  .route('/')

  .get((req, res, next) => {
    foldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(serializeFolder))
      })
      .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const { name, contents } = req.body
    const newFolder = { name } 

    for (const field of ['name']) {
      if (!req.body[field]) {
        console.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    foldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${folder.id}`))
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')

  .all((req, res, next) => {
    const { folder_id } = req.params
    foldersService.getById(req.app.get('db'), folder_id)
      .then(folder => {
        if (!folder) {
          console.error(`folder with id ${folder_id} not found.`)
          return res.status(404).json({
            error: { message: `folder Not Found` }
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })

  .get((req, res) => {
    res.json(serializeFolder(res.folder))
  })

  .delete((req, res, next) => {
    const { folder_id } = req.params
    foldersService.deleteFolder(
      req.app.get('db'),
      folder_id
    )
      .then(numRowsAffected => {
        console.info(`Folder with id ${folder_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(bodyParser, (req, res, next) => {
    console.log(req.body)
    const { name: folder_name } = req.body
    const folderToUpdate = { folder_name }

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      console.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'name'.`
        }
      })
    }

    // const error = getFolderValidationError(folderToUpdate)

    // if (error) return res.status(400).send(error)

    foldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foldersRouter
