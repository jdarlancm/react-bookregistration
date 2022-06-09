'use strict'

const Model = use('Model')

class Autor extends Model {
    
    livros() {
        return this.hasMany('App/Models/Livro')
    }
    
}

module.exports = Autor
