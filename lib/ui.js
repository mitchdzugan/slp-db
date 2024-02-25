import p from '../node_modules/preact/dist/preact.js';
import { memo } from '../node_modules/preact/compat/dist/compat.mjs';
import {
    useState, useContext, useRef, useMemo, useEffect, useCallback
} from '../node_modules/preact/hooks/dist/hooks.js';
import { create } from '../node_modules/mutative/dist/mutative.esm.mjs';

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
    div a p h1 h2 h3 h4 h5 span ul ol li strong aside button label input i
`);

$.render = (...args) => p.render(...args);
$.useStateVal = (...args) => useState(...args);
$.useState = (...args) => {
    const [state, setState] = useState(...args);
    const createState = (fn) => {
        const nextState = create({...state}, fn);
        if (state == nextState) { return false; }
        setState(nextState);
        return true;
    };
    return [state, createState];
};
$.useRef = (...args) => useRef(...args);
$.useMemo = (...args) => useMemo(...args);
$.useEffect = (...args) => useEffect(...args);
$.useContext = (...args) => useContext(...args);
$.useCallback = (...args) => useCallback(...args);
$.createContext = (...args) => p.createContext(...args);
$.AppContext = p.createContext({ appState: {}, createAppState: () => {} });
$.sub = (fn) => {
    const { appState } = useContext($.AppContext);
    const initialValueRef = useRef();
    initialValueRef.current ||= [create(appState, fn)];
    const [subVal, setSubVal] = useState(initialValueRef.current[0]);
    useEffect(
        () => {
            const nextSubVal = create(appState, fn);
            if (subVal == nextSubVal) { return () => {}; }
            setSubVal(nextSubVal);
            return () => {};
        },
        [appState]
    );
    return subVal;
};
$.useCreateAppState = () => {
    const { createAppState } = useContext($.AppContext);
    return createAppState;
};
$.useApi = () => $.sub(({ useApi }) => useApi);
$.memo = (...args) => memo(...args);

export default $;