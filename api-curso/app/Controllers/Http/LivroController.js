'use strict'
const Livro = use('App/Models/Livro');

class LivroController {
    
    async index() {
        const livros = await Livro.query().with('autor').fetch();
        
        return livros
    }

    async store({request, response}) {
        const livroInfo = request.only(['titulo','preco','autor_id']);
        

        const livro = new Livro();
        livro.titulo = livroInfo.titulo;
        livro.preco = livroInfo.preco;
        livro.autor_id = livroInfo.autor_id;
        if(livro.titulo ==='') {
            return response.status(400).json({
                errors: [
                    {
                        field: 'titulo',
                        msgErro: 'titulo não pode ser vazio.'
                    }
                ]
            })
        }
       
        await livro.save();
        const livros = await Livro.query().with('autor').fetch();
        response.status(201).json(livros)
        
    }
}

module.exports = LivroController
