import $ from './ui.js';

const getActiveTab = () => (
	$.sub((appState) => appState.activeTab || 'sessions')
);

const RawSideNav = () => {
	const createAppState = $.useCreateAppState();
	const activeTab = getActiveTab();
	console.log({activeTab});
	const mk = (id, title) => ({ id, title });
	const tabs = [
		mk('sessions', 'Sessions'),
		mk('jobs', 'Jobs'),
		mk('sources', 'Sources'),
	];
	return $.aside(
		{ className: 'menu section' },
		$.p(
			{ className: 'menu-label' },
			'slp-db'
		),
		$.ul(
			{ className: 'menu-list' },
			tabs.map((tab) => {
				return $.li(
					{ key: tab.id },
					$.a(
						{
							className: activeTab === tab.id ? 'is-active' : '',
							onClick: () => {
								createAppState(
									(appState) => { appState.activeTab = tab.id }
								);
							},
						},
						tab.title
					)
				)
			}),
		),
	)
};

const SideNav = () => {
	const [isOpen, setIsOpen] = $.useStateVal(false);
	const activeTab = getActiveTab();
	$.useEffect(() => { setIsOpen(false); return () => {}; }, [activeTab]);
	const toggle = () => setIsOpen(!isOpen);
	const className = (
		'column mobile-hide is-2-full-hd is-2-widescreen is-one-third-tablet'
	);
	return [
		$.div({ className }, $(RawSideNav)),
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

const Body = () => {
	const api = $.useApi();
	const [count, setCount] = $.useStateVal(0);

	return $.div(
		{ className: 'column' },
		'Hello World: [' + count + ']',
		$.button(
			{
				className: 'button is-primary',
				onClick: () => setCount(count + 1)
			},
			'inc'
		),
		$.button(
			{
				onClick: async () => {
					const res = await api('sessions');
					console.log('api res');
					console.log(res);
				},
			},
			'test api'
		)
	);
};

const Container = () => {
	return $.div({ className: 'columns' }, $(SideNav), $(Body));
};

const App = (statics) => {
	const [appState, createAppState] = $.useState({ statics });
	return $(
		$.AppContext.Provider,
		{ value: { appState, createAppState } },
		$(Container)
	);
};

export const timeout = (ms) => new Promise((done) => setTimeout(done, ms));

const handleLaunch = (statics) => {
	console.log({statics});
	$.render($(App, statics), document.getElementById('app'));
};

const waitOnStatic = async (onStatic) => {
	while (!window['slp-db-static']) {
		await timeout(500);
	}
	return onStatic(window['slp-db-static']);
};

export const launch = () => waitOnStatic(handleLaunch);