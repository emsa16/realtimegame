/*eslint no-unused-vars: "off", no-undef: "off", max-len: "off"*/
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import MessageContainer from './MessageContainer';

Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    const props = {
        output: ""
    };
    const component = mount(<MessageContainer {...props} />);

    component.setProps({ output: "test-output" });
});
