'use strict'
const Autor = use('App/Models/Autor');

class AutorController {

    async index() {
        const autors = await Autor.all();
        return autors;
    }

    async store({request, response}) {
        const autorInfo = request.only(['nome','email','senha']);

        const autor = new Autor();
        autor.nome = autorInfo.nome;
        autor.email = autorInfo.email;
        autor.senha = autorInfo.senha;

        if(autor.nome ==='') {
            return response.status(400).json({
                errors: [
                    {
                        field: 'nome',
                        msgErro: 'Nome não pode ser vazio.'
                    }
                ]
            })
        }

        await autor.save();
        
        const autors = await Autor.all();
        return response.status(201).json(autors)
    }
}

module.exports = AutorController
