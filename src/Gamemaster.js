/*eslint no-unused-vars: "off", max-len: "off"*/
import React, { Component } from 'react';
import Chat from './Chat.js';
import Game from './Game.js';
import api from './api';

class Gamemaster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            outGoingMessage: "",
            baddies: {},
            player: {},
            isConnected: false
        };

        this.loadPlayer();

        this.chatIsConnected = this.chatIsConnected.bind(this);
        this.chatIsDisconnected = this.chatIsDisconnected.bind(this);
        this.sendToChat = this.sendToChat.bind(this);
        this.messageSent = this.messageSent.bind(this);
        this.updateBaddies = this.updateBaddies.bind(this);
        this.removefromBaddies = this.removefromBaddies.bind(this);
        this.playerLoaded = this.playerLoaded.bind(this);
    }

    chatIsConnected() {
        this.setState({
            isConnected: true
        });
    }

    chatIsDisconnected() {
        this.setState({
            isConnected: false
        });
    }

    loadPlayer() {
        fetch(api.url + "player/", {
            headers: {'x-access-token': this.props.loginToken}
        })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    this.setState({
                        nickname: result.nickname,
                        player: {
                            nickname: result.nickname,
                            model: result.model,
                            position: result.position
                        }
                    });
                }
            })
            .catch(error => console.log(error));
    }

    playerLoaded() {
        this.setState({
            player: {}
        });
    }

    sendToChat(message) {
        this.setState({outGoingMessage: message});
    }

    messageSent() {
        this.setState({outGoingMessage: ""});
    }

    updateBaddies(nickname, model, position) {
        let baddies = this.state.baddies;

        baddies[nickname] = {
            model: model,
            position: position
        };

        this.setState({baddies: baddies});
    }

    removefromBaddies(nickname) {
        let baddies = this.state.baddies;

        delete baddies[nickname];

        this.setState({baddies: baddies});
    }

    render() {
        return (
            <div>
                <div className="game-container">
                    <Game
                        sendToChat={this.sendToChat}
                        playerLoaded={this.playerLoaded}
                        baddies={this.state.baddies}
                        player={this.state.player}
                        isConnected={this.state.isConnected}
                    />
                    <Chat
                        chatIsConnected={this.chatIsConnected}
                        chatIsDisconnected={this.chatIsDisconnected}
                        updateBaddies={this.updateBaddies}
                        removefromBaddies={this.removefromBaddies}
                        outGoingMessage={this.state.outGoingMessage}
                        messageSent={this.messageSent}
                        loginToken={this.props.loginToken}
                        nickname={this.state.nickname}
                    />
                </div>
                <div className="instructions">
                    <h3>Instructions</h3>
                    <p>Control the character with the arrow keys</p>
                    <p>Write by clicking in the chat message window</p>
                    <p>(NOTE: the arrow keys cannot be used to move the text cursor in the message field)</p>
                </div>
            </div>
        );
    }
}

export default Gamemaster;
