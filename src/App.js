/*eslint no-unused-vars: "off", max-len: "off"*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import Chat from './Chat.js';
import Game from './Game.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginToken: localStorage.getItem("JWT_TOKEN")
        };

        this.login = this.login.bind(this);
    }

    login(token) {
        localStorage.setItem("JWT_TOKEN", token);
        this.setState({loginToken: token});
    }

    logoutLink() {
        if (this.state.loginToken) {
            return <Link className="logout-button" to="/logout"><button>Log out</button></Link>;
        }
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="site-header">
                        <div className="site-title">Realtime game prototype</div>
                    </div>

                    <PrivateRoute path="/" loginToken={this.state.loginToken} component={() => (
                        <div>
                            <div className="game-container">
                                <Game />
                                <Chat loginToken={this.state.loginToken} />
                            </div>
                            <div className="instructions">
                                <h3>Instructions</h3>
                                <p>Control the character with the arrow keys</p>
                                <p>Write by clicking in the chat message window</p>
                                <p>(NOTE: the arrow keys cannot be used to move the text cursor in the message field)</p>
                            </div>
                        </div>
                    )} />

                    <Route path="/login" component={() => (
                        <div className="login-section">
                            <Login
                                loginToken={this.state.loginToken}
                                login={this.login}
                            />
                            <Register />
                        </div>
                    )} />

                    <Route path="/logout" component={() => {
                        localStorage.removeItem("JWT_TOKEN");
                        this.setState({loginToken: false});
                        return <Redirect to='/login' />;
                    }} />

                    { this.logoutLink() }

                    <div className="site-footer">
                        <hr />
                        <p>&copy; Copyright 2019 Emil Sandberg</p>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;



const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        rest.loginToken
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);
