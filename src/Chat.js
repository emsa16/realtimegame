/*eslint no-unused-vars: "off", max-len: "off"*/
/**
 * To setup a websocket connection, and nothing more.
 */

import React, { Component } from 'react';
import './Chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.websocket = "";
        this.url = "ws://localhost:1337";
        // this.url = "wss://ws.emilsandberg.com/";
        this.state = {
            message: "",
            nickname: "",
            output: "",
            conn_status: "",
            connect_button_color: "#000",
            close_button_color: "#d5dbdb"
        };
        this.chatBottom = "";

        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.connect = this.connect.bind(this);
        this.close = this.close.bind(this);
    }



    scrollToBottom() {
        this.chatBottom.scrollIntoView({ alignToTop: "false" });
    }



    componentDidMount() {
        this.scrollToBottom();
    }



    componentDidUpdate() {
        this.scrollToBottom();
    }



    /**
     * Log output to web browser.
     *
     * @param  {string} message to output in the browser window.
     *
     * @return {void}
     */
    outputLog(message) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString();

        this.setState({"output": `${this.state.output}${timestamp} ${message}<br />`});
    }



    parseIncomingMessage(message) {
        let msg;

        try {
            msg = JSON.parse(message);
        } catch (error) {
            console.log(`Invalid JSON: ${error}`);
            return;
        }

        const data = ("data" in msg) ? msg.data : "";
        const nick = ("nickname" in msg && msg.nickname) ? msg.nickname : "anonymous";
        const origin = ("origin" in msg && msg.origin) ? msg.origin : "server";

        if (data) {
            if ("server" === origin) {
                this.outputLog(`Server: ${data}`);
            } else {
                this.outputLog(`${nick}: ${data}`);
            }
        }
    }



    formatMessageOut(messageText) {
        let nick, data = {"command": "message", "params": {"message": messageText}};
        const re = /^\/([A-Za-z]+)\s*(\w*)/; // Regex matching '/' commands followed by text, e.g. /nick emil
        const result = re.exec(messageText);

        if (result && result.length > 1) {
            const command = result[1];

            switch (command) {
                case 'nick':
                    nick = result[2] ? result[2]: "";
                    data = {"command": "nick", "params": {"nickname": nick}};
                    break;
                default:
                    data = {"command": command};
            }
        }
        this.websocket.send(JSON.stringify(data));
    }



    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.id;

        this.setState({
            [name]: value
        });
    }



    sendMessage(event) {
        event.preventDefault();

        let messageText = this.state.message;

        if (!this.websocket || this.websocket.readyState === 3) {
            console.log("The websocket is not connected to a server.");
            this.outputLog("You are not connected to the chat.");
        } else {
            this.formatMessageOut(messageText);
            console.log(`Sending message: ${messageText}`);
            this.outputLog(`You: ${messageText}`);
            this.setState({"message": ""});
        }
    }



    /**
     * What to do when user clicks Connect
     */
    connect(event) {
        event.preventDefault();

        if (this.websocket && this.websocket.readyState !== 3) {
            console.log("Websocket is already connected");
            return;
        }

        let fullUrl = `${this.url}?token=${this.props.loginToken}&nickname=${this.state.nickname}`;

        console.log(`Connecting to: ${fullUrl}`);
        this.websocket = new WebSocket(fullUrl, 'broadcast');

        this.websocket.onopen = function() {
            console.log("The websocket is now open.");
            console.log(this.websocket);
            this.outputLog("You are now connected to chat.");
            this.setState({
                "conn_status": "Status: Connected",
                "nickname": "",
                "connect_button_color": "#D5DBDB",
                "close_button_color": "#000"
            });
        };
        this.websocket.onopen = this.websocket.onopen.bind(this);

        this.websocket.onmessage = function(event) {
            console.log(`Receiving message: ${event.data}`);
            console.log(event);
            console.log(this.websocket);
            this.parseIncomingMessage(event.data);
        };
        this.websocket.onmessage = this.websocket.onmessage.bind(this);

        this.websocket.onclose = function() {
            console.log("The websocket is now closed.");
            console.log(this.websocket);
            this.outputLog("Chat connection is now closed.");
            this.setState({
                "conn_status": "Status: Disconnected",
                "connect_button_color": "#000",
                "close_button_color": "#D5DBDB"
            });
        };
        this.websocket.onclose = this.websocket.onclose.bind(this);
    }



    /**
     * What to do when user clicks Close connection.
     */
    close(event) {
        if (!this.websocket || this.websocket.readyState === 3) {
            console.log("Websocket is already closed");
            return;
        }

        console.log("Closing websocket.");
        this.websocket.close(1000, "Client closing connection by intention.");
        console.log(this.websocket);
        this.outputLog("Closing chat.");
    }



    render() {
        return (
            <div className="chat" id="chat">
                <div id="MessageContainer" className="MessageContainer">
                    <div className="MessagesList" dangerouslySetInnerHTML={ {__html: this.state.output} } />
                    <div ref={(el) => { this.chatBottom = el; }} />
                </div>

                <form id="message_form" onSubmit={this.sendMessage}>
                    <p>
                        <input id="message" type="text" placeholder="Click here to write message" autoComplete="off" value={this.state.message} onChange={this.handleInputChange} />
                        <input id="send_message" type="submit" value="Send message" />
                    </p>
                </form>
                <form id="connect_form" onSubmit={this.connect}>
                    <p>
                        <input id="nickname" type="text" placeholder="Enter nickname" value={this.state.nickname} onChange={this.handleInputChange} />
                        <input id="connect" type="submit" value="Connect" style={{color: this.state.connect_button_color}} />
                        <input id="close" type="button" value="Close connection" style={{color: this.state.close_button_color}} onClick={this.close} />
                        <span id="status">{this.state.conn_status}</span>
                    </p>
                </form>
            </div>
        );
    }
}

export default Chat;
