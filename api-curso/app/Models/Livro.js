'use strict'

const Model = use('Model')

class Livro extends Model {
    
    autor() {
        return this.belongsTo('App/Models/Autor')
    }

}

module.exports = Livro
