/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './Game.js';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Game} />
                </Switch>
            </Router>
        );
    }
}

export default App;
