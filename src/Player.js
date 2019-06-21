/*eslint no-unused-vars: "off", max-len: "off"*/
import React, { Component } from 'react';
import api from './api';

class Player extends Component {
    constructor(props) {
        super(props);
        this.oldnick = "";
        this.oldmodel = "";
        this.state = {
            nickname: "",
            model: "",
            status: ""
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({nickname: event.target.value});
    }

    handleModelChange(event) {
        if (event.target.checked) {
            this.setState({model: event.target.value});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch(api.url + "player-upsert", {
            method: "POST",
            headers: {
                'x-access-token': this.props.loginToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nickname: this.state.nickname,
                model: this.state.model
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    this.setState({
                        status: result.message,
                    });
                    if (result.status === "ok") {
                        this.props.playerCreated();

                        if (this.props.isConnected) {
                            let toUpdate = [];

                            if (this.oldnick !== this.state.nickname) {
                                toUpdate.push("nickname");
                            }

                            if (this.oldmodel !== this.state.model) {
                                toUpdate.push("model");
                            }

                            this.props.updateChatServer(toUpdate);
                        }

                        this.oldnick = this.state.nickname;
                        this.oldmodel = this.state.model;
                    }
                }
            })
            .catch(error => console.log(error));
    }

    componentDidUpdate() {
        let player = this.props.player;

        if (Object.keys(player).length > 0) {
            this.setState({
                nickname: player.nickname,
                model: player.model
            });
            this.oldnick = player.nickname;
            this.oldmodel = player.model;
        }
    }

    render() {
        return (
            <div className="player-creation">
                <h3>Create/modify character</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="player-nickname">Character name</label>
                    <input id="player-nickname" name="nickname" type="text" pattern="[\w]+" title="Letters A to Z are allowed, no spaces" value={this.state.nickname} onChange={this.handleNameChange} required />

                    <p>Appearance</p>
                    <div className="player-models">
                        <label>
                            <input name="model" type="radio" value="basic" checked={this.state.model === "basic"} onChange={this.handleModelChange} required />
                            <div className="baddie baddie-basic"></div>
                        </label>
                        <label>
                            <input name="model" type="radio" value="ninja" checked={this.state.model === "ninja"} onChange={this.handleModelChange} />
                            <div className="baddie baddie-ninja"></div>
                        </label>
                        <label>
                            <input name="model" type="radio" value="pirate" checked={this.state.model === "pirate"} onChange={this.handleModelChange} />
                            <div className="baddie baddie-pirate"></div>
                        </label>
                        <label>
                            <input name="model" type="radio" value="borg" checked={this.state.model === "borg"} onChange={this.handleModelChange} />
                            <div className="baddie baddie-borg"></div>
                        </label>
                        <label>
                            <input name="model" type="radio" value="fox" checked={this.state.model === "fox"} onChange={this.handleModelChange} />
                            <div className="baddie baddie-fox"></div>
                        </label>
                    </div>

                    <input type="submit" value="Save" />
                    <div>{this.state.status}</div>
                </form>
            </div>
        );
    }
}

export default Player;
