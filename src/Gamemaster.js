/*eslint no-unused-vars: "off", max-len: "off"*/
import React, { Component } from 'react';
import Chat from './Chat.js';
import Game from './Game.js';

class Gamemaster extends Component {
    constructor(props) {

    render() {
        return (
            <div>
                <div className="game-container">
                    <Game
                    />
                    <Chat
                        loginToken={this.props.loginToken}
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
