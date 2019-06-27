/*eslint no-unused-vars: "off", max-len: "off"*/

import React, { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';

class MessageContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.MessageInnerContainer = React.createRef();
    }

    scrollToBottom() {
        const MessageInnerContainer = this.MessageInnerContainer.current;
        const contentHeight = MessageInnerContainer.scrollHeight;
        const windowHeight = MessageInnerContainer.clientHeight;
        const scrollAway = contentHeight - windowHeight;

        ReactDOM.findDOMNode(MessageInnerContainer).scrollTop = scrollAway;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div ref={this.MessageInnerContainer} id="MessageContainer" className="MessageContainer">
                <div className="MessagesList" dangerouslySetInnerHTML={ {__html: this.props.output} } />
            </div>
        );
    }
}

export default MessageContainer;
