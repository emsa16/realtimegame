/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import App from './App';
import Login from './Login';
import Gamemaster from './Gamemaster';

Enzyme.configure({ adapter: new Adapter() });



it('renders without crashing', () => {
    const component = shallow(<App />);

    expect(component.find('.App')).toHaveLength(1);
});

it('Logout button shows only when logged in', () => {
    const component = shallow(<App />);

    expect(component.find('.logout-button')).toHaveLength(0);
    component.setState({ loginToken: "token" });
    expect(component.update().find('.logout-button')).toHaveLength(1);
});

it('test main route while logged in', () => {
    localStorage.setItem("JWT_TOKEN", "token");

    const component = mount(<App />);

    expect(component.find(Gamemaster)).toHaveLength(1);
    expect(component.find(Login)).toHaveLength(0);

    localStorage.removeItem("JWT_TOKEN");
});

it('redirects to login screen if logged out', () => {
    const component = mount(<App />);

    expect(component.find(Login)).toHaveLength(1);
    expect(component.find(Gamemaster)).toHaveLength(0);
});

it('keeps login state', () => {
    const component = shallow(<App />);

    expect(component.state().loginToken).toBe(null);
    component.instance().login("token");
    expect(component.state().loginToken).toBe("token");
    component.instance().logout();
    expect(component.state().loginToken).toBe(false);
});
