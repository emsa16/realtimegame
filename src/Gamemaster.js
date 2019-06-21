/*eslint no-unused-vars: "off", max-len: "off"*/
import React, { Component } from 'react';
import Chat from './Chat.js';
import Game from './Game.js';
import Player from './Player.js';
import api from './api';

class Gamemaster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            outGoingMessage: "",
            baddies: {},
            player: {},
            isConnected: false,
            playerIsLoaded: false
        };

        this.loadPlayer();

        this.chatIsConnected = this.chatIsConnected.bind(this);
        this.chatIsDisconnected = this.chatIsDisconnected.bind(this);
        this.playerCreated = this.playerCreated.bind(this);
        this.updateChatServer = this.updateChatServer.bind(this);
        this.sendToChat = this.sendToChat.bind(this);
        this.messageSent = this.messageSent.bind(this);
        this.addToBaddies = this.addToBaddies.bind(this);
        this.updateBaddiesNick = this.updateBaddiesNick.bind(this);
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
            isConnected: false,
            baddies: {}
        });
    }

    loadPlayer() {
        fetch(api.url + "player/", {
            headers: {'x-access-token': this.props.loginToken}
        })
            .then(response => response.json())
            .then(result => {
                if (result && "nickname" in result && "model" in result && "position" in result) {
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
            player: {},
            playerIsLoaded: true
        });
    }

    playerCreated() {
        this.loadPlayer();
    }

    updateChatServer(update) {
        fetch(api.url + "player/", {
            headers: {'x-access-token': this.props.loginToken}
        })
            .then(response => response.json())
            .then(result => {
                if (result && "nickname" in result && "position" in result) {
                    if (update.includes("nickname")) {
                        this.sendToChat(`/nick ${result.nickname}`);
                    }

                    if (update.includes("model")) {
                        let [x, y, dir] = result.position.split(',');

                        this.sendToChat(`/move ${x},${y},${dir}`);
                    }
                }
            })
            .catch(error => console.log(error));
    }

    sendToChat(message) {
        this.setState({outGoingMessage: message});
    }

    messageSent() {
        this.setState({outGoingMessage: ""});
    }

    addToBaddies(nickname, model, position) {
        let baddies = this.state.baddies;

        baddies[nickname] = {
            model: model,
            position: position
        };

        this.setState({baddies: baddies});
    }

    updateBaddiesNick(oldnick, newnick) {
        let baddies = this.state.baddies;

        let baddieObj = baddies[oldnick];

        if (baddieObj) {
            delete baddies[oldnick];

            baddies[newnick] = baddieObj;

            this.setState({baddies: baddies});
        }
    }

    removefromBaddies(nickname) {
        let baddies = this.state.baddies;

        delete baddies[nickname];

        this.setState({baddies: baddies});
    }

    render() {
        return (
            <div className="gamemaster-container">
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
                        addToBaddies={this.addToBaddies}
                        updateBaddiesNick={this.updateBaddiesNick}
                        removefromBaddies={this.removefromBaddies}
                        outGoingMessage={this.state.outGoingMessage}
                        messageSent={this.messageSent}
                        loginToken={this.props.loginToken}
                        nickname={this.state.nickname}
                        playerIsLoaded={this.state.playerIsLoaded}
                    />
                </div>
                <Player
                    loginToken={this.props.loginToken}
                    playerCreated={this.playerCreated}
                    player={this.state.player}
                    isConnected={this.state.isConnected}
                    updateChatServer={this.updateChatServer}
                />
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
