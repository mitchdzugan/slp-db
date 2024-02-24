import $ from './ui.js';

const MyComponent = ({ name }) => {
    return $.div(`hello ${name}`)
};

export const launch = () => {
    $.render(
        $.div(
            {},
            $.span('Hello there world!!!!'),
            $(MyComponent, { name: 'Jim' }),
            $(MyComponent, { name: 'Joe' }),
        ),
        document.getElementById('app')
    );
};