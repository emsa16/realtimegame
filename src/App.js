/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import Gamemaster from './Gamemaster.js';
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
                        <Gamemaster loginToken={this.state.loginToken} />
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
