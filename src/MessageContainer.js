/*eslint no-unused-vars: "off", max-len: "off"*/

import React, { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';

class MessageContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.messageContainer = React.createRef();
    }

    scrollToBottom() {
        const MessageContainer = this.messageContainer.current;
        const contentHeight = MessageContainer.scrollHeight;
        const windowHeight = MessageContainer.clientHeight;
        const scrollAway = contentHeight - windowHeight;

        ReactDOM.findDOMNode(MessageContainer).scrollTop = scrollAway;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div ref={this.messageContainer} id="MessageContainer" className="MessageContainer">
                <div className="MessagesList" dangerouslySetInnerHTML={ {__html: this.props.output} } />
            </div>
        );
    }
}

export default MessageContainer;
