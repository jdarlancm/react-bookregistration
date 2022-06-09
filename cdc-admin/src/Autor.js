import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {
          nome: '',
          email: '',
          senha: ''
        };
    }

    //O evento é do react nao do DOM
    enviaForm = (evento) => {
        evento.preventDefault();

        $.ajax({
            url:"http://127.0.0.1:3333/autors",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({nome:this.state.nome, email: this.state.email, senha: this.state.senha}),
            beforeSend: function() {
                PubSub.publish('limpa-erros',{});
            }
        })
        .done(novaListagem => {
            PubSub.publish('atualiza-lista-autores',novaListagem);
            this.setState({nome:'',email:'',senha:''})
            console.log('Sucesso')
        })
        .fail(erro => {
            
            if(erro.status === 400) {
                new TratadorErros().publicaErros(erro.responseJSON);
            }
        })
    }

    salvaAlteracao = (nomeInput, evento) => {
        this.setState({[nomeInput]: evento.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                
                <InputCustomizado id="nome" type="text" label="Nome" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} />
                <InputCustomizado id="email" type="email" label="E-mail" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} />
                <InputCustomizado id="senha" type="password" label="Senha" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} />
                <div className="pure-control-group">
                    <label></label>
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    
                    this.props.lista.map(function(autor) {
                      return (
                        <tr key={autor.id}>
                          <td>{autor.nome}</td>
                          <td>{autor.email}</td>
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

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista : [] };
    }

    componentDidMount() {
        //Usando a biblioteca nativa JS
        /*fetch("http://cdc-react.herokuapp.com/api/autores")
        .then(resposta => resposta.json())
        .then(res => this.setState({lista:res}))*/
        
        //Usando JQuery     
        $.ajax({
            url:"http://127.0.0.1:3333/autors",
            dataType: 'json'
        }).done(resposta =>  this.setState({lista:resposta}))

        PubSub.subscribe('atualiza-lista-autores', (topico,novaLista) => this.setState({lista:novaLista}));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }
}