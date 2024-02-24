import $ from './ui.js';

const RawSideNav = () => {
    return $.aside(
        { className: 'menu section' },
        $.p(
            { className: 'menu-label' },
            'VIEWS'
        ),
        $.ul(
            { className: 'menu-list' },
            $.li(
                $.a({ href: '#/' }, 'Sources')
            )
        ),
    )
};

const SideNav = () => {
    const [isOpen, setIsOpen] = $.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return [
        $.div(
            { className: 'column mobile-hide is-2-full-hd is-2-widescreen is-one-third-tablet' },
            $(RawSideNav),
        ),
        $.div(
            {
                style: {
                    position: 'absolute',
                    top: '1.5rem',
                    left: '25vw',
                    zIndex: '1',
                },
                className: 'mobile-only column is-half-mobile'
            },
            !isOpen ? [] : $.div({ className: 'box' }, $(RawSideNav))
        ),
        $.a(
            {
                style: {
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    padding: '1.0rem',
                    zIndex: '2',
                },
                onClick: toggle,
                className: 'mobile-only notification'
            },
            $.div(
                {
                    style: {
                        width: '1.0rem',
                        textAlign: 'center'
                    }
                },
                isOpen ? ' ✕ ' : ' ≡ '
            ),
        ),
    ];
};

const App = () => {
    const [count, setCount] = $.useState(0);

    return $.div(
        $.div(
            { className: 'columns' },
            $(SideNav),
            $.div(
                { className: 'column' },
                'Hello World: [' + count + ']',
                $.button(
                    {
                        className: 'button is-primary',
                        onClick: () => setCount(count + 1)
                    },
                    'inc'
                ),
            ),
        ),
    );
};

export const launch = () => {
    $.render($(App), document.getElementById('app'));
};