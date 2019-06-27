/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Register from './Register';

Enzyme.configure({ adapter: new Adapter() });



it('renders without crashing', () => {
    const register = shallow(<Register />);

    expect(register.find('.register')).toHaveLength(1);
});

it('change form input', () => {
    const register = shallow(<Register />);

    register.find('#register-username').simulate('change', {target: {name: "username", value: 'tester'}});

    expect(register.find('#register-username').props().value).toEqual('tester');
});

it('sends form input and displays status message', (done) => {
    const mockSuccessResponse = {message: "ok"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const register = shallow(<Register />);

    register.find('#register-username').simulate('change', {target: {name: "username", value: 'tester'}});
    register.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    process.nextTick(() => {
        expect(register.find('.form-status').text()).toEqual('ok');

        global.fetch.mockClear();
        done();
    });
});
