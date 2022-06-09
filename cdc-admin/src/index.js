import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './index.css';

import App from './App';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro';

import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    (<BrowserRouter>
        <App>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={LivroBox} />
            </Switch>
        </App>
    </BrowserRouter>)
    , document.getElementById('root')
);

registerServiceWorker();
