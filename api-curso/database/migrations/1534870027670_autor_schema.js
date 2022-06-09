'use strict'

const Schema = use('Schema')

class AutorSchema extends Schema {
  up () {
    this.create('autors', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('senha', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('autors')
  }
}

module.exports = AutorSchema
