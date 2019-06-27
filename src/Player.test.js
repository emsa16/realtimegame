/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Player from './Player';

Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    const props = {
        player: {}
    };
    const component = shallow(<Player {...props} />);

    expect(component.find('.player-creation')).toHaveLength(1);
});

it('change form input - name', () => {
    const props = {
        player: {}
    };
    const component = shallow(<Player {...props} />);

    component.find('#player-nickname').simulate('change', {target: {value: 'Locutus'}});

    expect(component.find('#player-nickname').props().value).toEqual('Locutus');
});

it('change form input - model', () => {
    const props = {
        player: {}
    };
    const component = shallow(<Player {...props} />);

    expect(component.find('.player-models input[value="borg"]').props().checked).toEqual(false);

    component.find('.player-models input[value="borg"]').simulate('change', {target: {checked: true, value: "borg"}});

    expect(component.find('.player-models input[value="borg"]').props().checked).toEqual(true);
});

it('sends form input and displays status message', (done) => {
    const props = {
        player: {},
        isConnected: true,
        playerCreated: jest.fn(),
        updateChatServer: jest.fn(),
        playerLoaded: jest.fn()
    };

    const mockSuccessResponse = {message: "updated", status: "ok"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const component = mount(<Player {...props} />);

    component.find('#player-nickname').simulate('change', {target: {name: "nickname", value: 'Locutus'}});
    component.find('.player-models input[value="borg"]').simulate('change', {target: {checked: true, value: "borg"}});
    component.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    process.nextTick(() => {
        expect(component.find('.form-status').text()).toEqual('updated');

        global.fetch.mockClear();
        done();
    });
});

it('loads in player character from higher component', () => {
    const props = {
        player: {nickname: "Ulthar", model: "basic"},
        playerLoaded: jest.fn()
    };
    const component = shallow(<Player {...props} />);

    component.instance().componentDidUpdate();
    component.setProps({player: {}});
    expect(component.update().state().nickname).toBe("Ulthar");
    expect(component.state().model).toBe("basic");
});
