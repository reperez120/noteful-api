const foldersService = {
    getAllFolders(knex) {
      return knex.select('*').from('folders')
    },
  
    getById(knex, id) {
      return knex.from('folders').select('*').where('id', id).first()
    },
  
    insertFolder(knex, newFolder) {
      newFolder = {
        folder_name: newFolder.name,
        id: newFolder.id,
        contents: newFolder.contents
      }
      console.log(newFolder)
  
      return knex
        .insert(newFolder)
        .into('folders')
        .returning('*')
        .then(rows => rows[0])
    },
  
    deleteFolder(knex, id) {
      return knex('folders')
        .where({ id })
        .delete()
    },
  
    updateFolder(knex, id, newFolderFields) {
      return knex('folders')
        .where({ id })
        .update(newFolderFields)
    },
  
  }
  
  module.exports = foldersService