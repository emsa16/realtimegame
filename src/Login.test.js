/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';

Enzyme.configure({ adapter: new Adapter() });



it('renders without crashing', () => {
    const props = {
        loginToken: "",
        login: jest.fn()
    };

    const login = shallow(<Login {...props} />);

    expect(login.find('.login')).toHaveLength(1);
});

it('redirects to main screen if logged in', () => {
    const props = {
        loginToken: "token",
        login: jest.fn()
    };

    const login = shallow(<Login {...props} />);

    expect(login.find(Redirect)).toHaveLength(1);
});

it('change form input', () => {
    const props = {
        loginToken: "",
        login: jest.fn()
    };
    const login = shallow(<Login {...props} />);

    login.find('#login-username').simulate('change', {target: {name: "username", value: 'tester'}});

    expect(login.find('#login-username').props().value).toEqual('tester');
});

it('sends form input and displays status message', (done) => {
    const props = {
        loginToken: "",
        login: jest.fn()
    };

    const mockSuccessResponse = {message: "ok", token: "token"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const login = shallow(<Login {...props} />);

    login.find('#login-username').simulate('change', {target: {name: "username", value: 'tester'}});
    login.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    process.nextTick(() => {
        expect(login.find('.form-status').text()).toEqual('ok');

        global.fetch.mockClear();
        done();
    });
});
