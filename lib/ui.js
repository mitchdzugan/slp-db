import p from '../node_modules/preact/dist/preact.js';

const isProps = (v) => (
    ((typeof v) === 'object') && !Array.isArray(v) && !v.props
);

const $ = (C, ...rest) => {
    const [
        props = {},
        children = undefined,
    ] = (() => {
        if (!isProps(rest[0])) {
            if (rest.length > 1) {
                return [{}, rest];
            } else {
                return [{}, rest[0]]
            }
        } else {
            if (rest.length > 2) {
                return [rest[0], rest.slice(1)];
            } else {
                return [rest[0], rest[1]];
            }
        }
    })();
    return children === undefined ?
        p.createElement(C, props) :
        p.createElement(C, props, children);
};

const addTags = (tagsStr) => {
    for (const tag of tagsStr.split(/\s+/).filter((str) => !!str)) {
        $[tag] = (...args) => $(tag, ...args);
    }
};
addTags(`
    div a p h1 h2 h3 h4 h5 span ul ol li strong
`);

$.render = (...args) => p.render(...args);

export default $;