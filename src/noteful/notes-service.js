const notesService = {
    getAllNotes(knex) {
         return knex.select('*').from('notes')
     },
 
     getById(knex, id) {
         return knex.from('notes').select('*').where('id', id).first()
     },
 
     insertNote(knex, newNote) {
         newNote = {
             date_modified:newNote.date, 
             note_name:newNote.name, 
             id: newNote.id, 
             content: newNote.content,
             folder: newNote.folder
         }
 
         return knex
             .insert(newNote)
             .into('notes')
             .returning('*')
             .then(rows => rows[0])
         },
     
     deleteNote(knex, id) {
         return knex('notes')
             .where({ id })
             .delete()
     },
     
     updateNote(knex, id, newNoteFields) {
         return knex('notes')
             .where({ id })
             .update(newNoteFields)
     },
 }
 
 module.exports = notesService