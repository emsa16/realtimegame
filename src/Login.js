/*eslint no-unused-vars: "off", max-len: "off"*/
/**
 * Login management
 */

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import api from './api';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            status: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch(api.url + "login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    this.setState({
                        status: result.message,
                    });

                    if (result.token) {
                        localStorage.setItem("JWT_TOKEN", result.token);
                        this.props.login();
                    }
                }
            });
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Redirect to='/' />;
        }

        return (
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="login-username">Username</label>
                    <input id="login-username" name="username" type="text" value={this.state.username} onChange={this.handleChange} />
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="submit" value="Login" />
                    <div>{this.state.status}</div>
                </form>
            </div>
        );
    }
}

export default Login;
