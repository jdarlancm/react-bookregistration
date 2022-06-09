import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {
          titulo: '',
          preco: '',
          autorId: ''
        };
    }

    //O evento é do react nao do DOM
    enviaForm = (evento) => {
        evento.preventDefault();

        $.ajax({
            url:"http://127.0.0.1:3333/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo:this.state.titulo, preco: this.state.preco, autor_id: this.state.autorId}),
            beforeSend: function() {
                PubSub.publish('limpa-erros',{});
            }
        })
        .done(novaListagem => {
            console.log(novaListagem)
            PubSub.publish('atualiza-lista-livros',novaListagem);
            this.setState({titulo:'',preco:'',autorId:''})
            console.log('Sucesso')
        })
        .fail(erro => {
            
            if(erro.status === 400) {
                new TratadorErros().publicaErros(erro.responseJSON);
            }

            if(erro.status === 500) {
                console.log(erro.responseJSON)
            }
        })

    }

    setTitulo = (evento) => {
        this.setState({titulo: evento.target.value});
    }

    setPreco = (evento) => {
        this.setState({preco: evento.target.value});
    }

    setAutorId = (evento) => {
        this.setState({autorId: evento.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                
                <InputCustomizado id="titulo" type="text" label="Título" name="titulo" value={this.state.titulo} onChange={this.setTitulo} />
                <InputCustomizado id="preco" type="text" label="Preço" name="preco" value={this.state.preco} onChange={this.setPreco} />
                <div className="pure-control-group">
                    <label htmlFor="autorId">Autor</label>
                    <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId}>
                        <option value="">Selection o Autor</option>
                        { 
                            this.props.autores.map(autor => {
                                return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                            })
                        }
                    </select>
                </div>
                <div className="pure-control-group">
                    <label></label>
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
                </form>
            </div>
        );
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Preço</th>
                    <th>Autor</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    
                    this.props.lista.map(function(livro) {
                      return (
                        <tr key={livro.id}>
                          <td>{livro.titulo}</td>
                          <td>{livro.preco}</td>
                          <td>{livro.autor.nome}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
        );
    }
}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { lista : [], autores : [] };
    }

    componentDidMount() {
        $.ajax({
            url:"http://127.0.0.1:3333/livros",
            dataType: 'json'
        }).done(resposta =>  {
            this.setState({lista:resposta})
        })

        PubSub.subscribe('atualiza-lista-livros', (topico,novaLista) => this.setState({lista:novaLista}));

        $.ajax({
            url:"http://127.0.0.1:3333/autors",
            dataType: 'json'
        }).done(resposta =>  this.setState({autores:resposta}))


    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}