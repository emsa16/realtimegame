/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Server } from 'mock-socket';
import React from 'react';
import Chat from './Chat';

Enzyme.configure({ adapter: new Adapter() });

const MOCK_CHAT_URL = 'ws://localhost:8080';

it('renders without crashing', () => {
    const component = shallow(<Chat />);

    expect(component.find('.chat')).toHaveLength(1);
});

it('connects to chat server', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        expect(component.update().find("#status").text()).toEqual('Status: Connected');
        component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() }); // The component stops another connection when it is already connected
        mockServer.stop(done);
    }, 100);
});

it('displays error message if connection cannot be established', (done) => {
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        expect(component.update().find("#status").text()).toEqual('Connection error (invalid token?)');
        done();
    }, 100);
});

it('cannot connect to chat server when player is missing', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: false,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        expect(component.update().find("#status").text()).toEqual('You have no player character yet');
        mockServer.stop(done);
    }, 100);
});

it('closes a chat server connection', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#close').simulate('click');
        setTimeout(() => {
            expect(component.update().find("#status").text()).toEqual('Status: Disconnected');
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('cannot close an already closed connection', (done) => {
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#close').simulate('click');

    setTimeout(() => {
        expect(component.update().find("#status").text()).toEqual('');
        done();
    }, 100);
});

it('change message form input', () => {
    const props = {
    };
    const component = shallow(<Chat {...props} />);

    component.find('#message').simulate('change', {target: {id: "message", value: 'test message'}});
    expect(component.update().find('#message').props().value).toEqual('test message');
});

it('sends message form input', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'test message'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        expect(component.update().state().output).toEqual(expect.stringContaining('test message'));

        mockServer.stop(done);
    }, 100);
});

it('cannot send message if not connected to chat', (done) => {
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#message').simulate('change', {target: {id: "message", value: 'test message'}});
    component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        expect(component.update().state().output).toEqual(expect.stringContaining('You are not connected to the chat'));
        done();
    }, 100);
});

it('sends nick command message to server from game component', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "/nick tester",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.update();

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.stringContaining('Nick changed to tester'));

            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('sends move command message to server from game component', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "/move 8,7,r",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.update();

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.stringContaining('You moved position'));

            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('sends move command message to server from game component', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "/random text",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.update();

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.stringContaining('Random command, server does nothing'));

            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('cannot send command messages from the chat', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: '/nick tester'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        expect(component.update().state().output).toEqual(expect.stringContaining('The capability to perform this command has been turned off in this chat'));

        mockServer.stop(done);
    }, 100);
});

it('receives message and formats it', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message1'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.stringContaining('test message 1'));
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('does not treat misformatted incoming messages', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message2'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.not.stringContaining('test message 2'));
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('does not treat incoming messages without data', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message3'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(component.update().state().output).toEqual(expect.not.stringContaining('bad-tester'));
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('receives update action message and treats it', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const spy = jest.spyOn(props, 'updateBaddiesNick');
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message4'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('receives remove action message and treats it', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const spy = jest.spyOn(props, 'removefromBaddies');
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message5'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            mockServer.stop(done);
        }, 100);
    }, 100);
});

it('receives addbaddie special message and treats it', (done) => {
    const mockServer = startMockServer();
    const props = {
        url: MOCK_CHAT_URL,
        outGoingMessage: "",
        playerIsLoaded: true,
        chatIsConnected: jest.fn(),
        chatIsDisconnected: jest.fn(),
        addToBaddies: jest.fn(),
        updateBaddiesNick: jest.fn(),
        removefromBaddies: jest.fn(),
        messageSent: jest.fn(),
    };
    const spy = jest.spyOn(props, 'addToBaddies');
    const component = shallow(<Chat {...props} />);

    component.find('#connect_form').simulate('submit', { preventDefault: jest.fn() });

    setTimeout(() => {
        component.find('#message').simulate('change', {target: {id: "message", value: 'trigger-message6'}});
        component.find('#message_form').simulate('submit', { preventDefault: jest.fn() });

        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            mockServer.stop(done);
        }, 100);
    }, 100);
});



//Helper functions
function startMockServer() {
    const mockServer = new Server(MOCK_CHAT_URL);

    mockServer.on('connection', socket => {
        socket.on('message', data => {
            if (data.indexOf("trigger-message1") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": "test message 1"}');
            } else if (data.indexOf("trigger-message2") > -1) {
                socket.send('{"origin": "user", "nickname" "tester", "data": "test message 2"}');
            } else if (data.indexOf("trigger-message3") > -1) {
                socket.send('{"origin": "user", "nickname": "bad-tester", "data": ""}');
            } else if (data.indexOf("nick") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": "Nick changed to tester"}');
            } else if (data.indexOf("move") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": "You moved position"}');
            } else if (data.indexOf("random") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": "Random command, server does nothing"}');
            } else if (data.indexOf("trigger-message4") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": {"action": "update-nick", "old_nickname": "tester1", "new_nickname": "tester2"}}');
            } else if (data.indexOf("trigger-message5") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": {"action": "remove", "nickname": "tester"}}');
            } else if (data.indexOf("trigger-message6") > -1) {
                socket.send('{"origin": "user", "nickname": "tester", "data": {"position": "7,7,r", "model": "basic"}}');
            }
        });
    });
    return mockServer;
}
