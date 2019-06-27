/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Gamemaster from './Gamemaster';

Enzyme.configure({ adapter: new Adapter() });



it('renders without crashing', () => {
    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    expect(component.find('.gamemaster-container')).toHaveLength(1);
});

it('loads the player upon initialization', (done) => {
    const mockSuccessResponse = {nickname: "Ulthar", model: "basic", position: "7,7,r"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    expect(component.find('.gamemaster-container')).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    process.nextTick(() => {
        expect(component.update().state().player).toEqual({nickname: "Ulthar", model: "basic", position: "7,7,r"});

        global.fetch.mockClear();
        done();
    });
});

it('keeps chat state', () => {
    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    expect(component.state().isConnected).toBe(false);
    component.instance().chatIsConnected();
    expect(component.state().isConnected).toBe(true);
    component.instance().chatIsDisconnected();
    expect(component.state().isConnected).toBe(false);
});

it('relays messages from game to chat', () => {
    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    expect(component.state().outGoingMessage).toBe("");
    component.instance().sendToChat("test message");
    expect(component.state().outGoingMessage).toBe("test message");
    component.instance().messageSent();
    expect(component.state().outGoingMessage).toBe("");
});

it('clears player prop when it has been loaded into lower component', (done) => {
    const mockSuccessResponse = {nickname: "Ulthar", model: "basic", position: "7,7,r"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    process.nextTick(() => {
        expect(component.update().state().playerIsLoaded).toEqual(false);
        expect(component.update().state().player).toEqual({nickname: "Ulthar", model: "basic", position: "7,7,r"});
        component.instance().playerLoaded();
        expect(component.update().state().playerIsLoaded).toEqual(true);
        expect(component.update().state().player).toEqual({});

        global.fetch.mockClear();
        done();
    });
});

it('updates player details to chat server', (done) => {
    const mockSuccessResponse = {nickname: "Ulthar", position: "7,7,r"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const props = {
        loginToken: ""
    };
    const component = shallow(<Gamemaster {...props} />);

    component.instance().updateChatServer(["nickname"]);

    setTimeout(() => {
        expect(component.update().state().outGoingMessage).toBe("/nick Ulthar");
        component.instance().updateChatServer(["model"]);

        setTimeout(() => {
            expect(component.state().outGoingMessage).toBe("/move 7,7,r");
            expect(global.fetch).toHaveBeenCalledTimes(3);

            global.fetch.mockClear();
            done();
        }, 100);
    }, 100);
});

it('manages other players avatars', () => {
    const props = {
        loginToken: ""
    };
    const component = shallow(<Gamemaster {...props} />);

    expect(component.state().baddies).toEqual({});
    component.instance().addToBaddies("Ulthar", "basic", "7,7,r");
    expect(component.state().baddies).toEqual({Ulthar: {model: "basic", position: "7,7,r"}});
    component.instance().updateBaddiesNick("Ulthar", "Drax");
    expect(component.state().baddies).toEqual({Drax: {model: "basic", position: "7,7,r"}});
    component.instance().removefromBaddies("Drax");
    expect(component.state().baddies).toEqual({});
});

it('reloads the player details on command', (done) => {
    const mockSuccessResponse = {nickname: "Ulthar", model: "basic", position: "7,7,r"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const props = {
        loginToken: ""
    };

    const component = shallow(<Gamemaster {...props} />);

    setTimeout(() => {
        const mockSuccessResponse2 = {nickname: "Drax", model: "basic", position: "7,7,r"};
        const mockJsonPromise2 = Promise.resolve(mockSuccessResponse2);
        const mockFetchPromise2 = Promise.resolve({
            json: () => mockJsonPromise2,
        });

        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise2);

        component.instance().playerCreated();

        setTimeout(() => {
            expect(component.update().state().player).toEqual({nickname: "Drax", model: "basic", position: "7,7,r"});
            global.fetch.mockClear();
            done();
        }, 100);
    }, 100);
});
