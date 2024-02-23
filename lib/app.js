import p from '../node_modules/preact/dist/preact.js';

export const launch = () => {
    p.render(
        p.createElement('div', { children: 'Hello World' }),
        document.getElementById('app')
    );
};