'use strict'

const Schema = use('Schema')

class LivroSchema extends Schema {
  up () {
    this.create('livros', (table) => {
      table.increments()
      table.string('titulo',255).notNullable()
      table.float('preco').notNullable()
      table.integer('autor_id').unsigned().index('autor_id')
      table.foreign('autor_id').references('autors.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('livros')
  }
}

module.exports = LivroSchema
