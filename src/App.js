/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import Game from './Game.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: localStorage.getItem("JWT_TOKEN")
        };

        this.login = this.login.bind(this);
    }

    login() {
        this.setState({isLoggedIn: true});
    }

    logoutLink() {
        if (this.state.isLoggedIn) {
            return <Link className="logout-button button" to="/logout">Log out</Link>;
        }
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="site-header">
                        <div className="site-title">Realtime game prototype</div>
                    </div>

                    <PrivateRoute path="/" component={() => (
                        <div className="game-container">
                            <div>
                                <Game />
                                <p>Control the character with the arrow keys</p>
                            </div>
                        </div>
                    )
                    } />

                    <Route path="/login" component={() => (
                        <div className="login-section">
                            <Login
                                isLoggedIn={this.state.isLoggedIn}
                                login={this.login}
                            />
                            <Register />
                        </div>
                    )
                    } />

                    <Route path="/logout" component={() => {
                        localStorage.removeItem("JWT_TOKEN");
                        this.setState({isLoggedIn: false});
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
        localStorage.getItem("JWT_TOKEN") //TEMP inte snyggt
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);
