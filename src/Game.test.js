/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Game from './Game';

Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    let props = {
        isConnected: true,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const component = mount(<Game {...props} />);

    expect(component.find('.game-field')).toHaveLength(1);
});

it('moves player character on key input', () => {
    let left, newLeft, top, newTop, props = {
        isConnected: true,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const component = mount(<Game {...props} />);

    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newLeft)).toBeGreaterThan(parseInt(left));

    top = component.update().find('.own-baddie').prop('style').top;
    map.keydown({ keyCode: 38, which: 38, preventDefault: jest.fn()}); //up
    newTop = component.update().find('.own-baddie').prop('style').top;
    expect(parseInt(newTop)).toBeLessThan(parseInt(top));

    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 37, which: 37, preventDefault: jest.fn()}); //left
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newLeft)).toBeLessThan(parseInt(left));

    top = component.update().find('.own-baddie').prop('style').top;
    map.keydown({ keyCode: 40, which: 40, preventDefault: jest.fn()}); //down
    newTop = component.update().find('.own-baddie').prop('style').top;
    expect(parseInt(newTop)).toBeGreaterThan(parseInt(top));

    top = component.update().find('.own-baddie').prop('style').top;
    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 32, which: 32, preventDefault: jest.fn()}); //space
    newTop = component.update().find('.own-baddie').prop('style').top;
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newTop)).toEqual(parseInt(top));
    expect(parseInt(newLeft)).toEqual(parseInt(left));
});

it('moves player character on door tiles', () => {
    let left, newLeft, props = {
        isConnected: true,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const component = mount(<Game {...props} />);

    //Move into test start position, just left of a door tile
    map.keydown({ keyCode: 38, which: 38, preventDefault: jest.fn()}); //up
    map.keydown({ keyCode: 38, which: 38, preventDefault: jest.fn()}); //up
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right

    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newLeft)).toBeGreaterThan(parseInt(left));
});

it('does not move player character on wall tiles', () => {
    let left, newLeft, props = {
        isConnected: true,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const component = mount(<Game {...props} />);

    //Move into test start position, two steps left of a wall tile
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right

    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newLeft)).toBeGreaterThan(parseInt(left));

    left = component.update().find('.own-baddie').prop('style').left;
    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right
    newLeft = component.update().find('.own-baddie').prop('style').left;
    expect(parseInt(newLeft)).toEqual(parseInt(left));
});

it('does not create or move player character when not connected', () => {
    let left, newLeft, props = {
        isConnected: false,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const component = mount(<Game {...props} />);

    map.keydown({ keyCode: 39, which: 39, preventDefault: jest.fn()}); //right

    expect(component.update().find('.own-baddie')).toHaveLength(0);
});

it('cannot move player beyond board edge', () => {
    let props = {
        isConnected: true,
        baddies: {Ulthar: {position: "7,7,r", model: "basic"}},
        player: {},
        sendToChat: jest.fn(),
        playerLoaded: jest.fn()
    };

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    const component = mount(<Game {...props} />);

    const isBaddieMovable = component.instance().isBaddieMovable(20, 0);

    expect(isBaddieMovable).toBe(false);
});

it('loads in player character from higher component', () => {
    const props = {
        player: {nickname: "Ulthar", model: "basic", position: "7,8,r"},
        playerLoaded: jest.fn()
    };
    const component = mount(<Game {...props} />);

    component.instance().componentDidUpdate();
    component.setProps({player: {}});
    expect(component.update().state().nickname).toBe("Ulthar");
    expect(component.state().baddie_model).toBe("basic");
    expect(component.state().baddie_dir).toBe(" ");
    expect(component.state().baddie_x).toBe(7);
    expect(component.state().baddie_y).toBe(8);
});
