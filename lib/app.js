import $ from './ui.js';
import openFolderSelect from '../node_modules/nw-programmatic-folder-select/index.js';

const subActiveTab = () => $.sub(state => state.activeTab || 'loading');

const RawSideNav = $.memo(() => {
	const createAppState = $.useCreateAppState();
	const activeTab = subActiveTab();
	const mk = (id, title) => ({ id, title });
	const tabs = [
		mk('config', 'CONFIG'),
		mk('sources', 'SOURCES'),
		mk('processors', 'PROCESSORS'),
		mk('workers', 'WORKERS'),
		mk('highlights', 'HIGHLIGHTS'),
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
});

const Hamburger = $.memo(({ onClick = () => {}, isOpen, isHidden }) => {
	return $.a(
		{
			style: {
				padding: '0.5rem',
				margin: '0 0 0.25rem 0',
				zIndex: '30',
				...(
					isHidden ? {
						visibility: 'hidden'
					} : {
						position: 'absolute',
						top: '0.5rem',
						left: 'calc(50vw - 0.5rem)',
					}
				),
			},
			onClick,
			className: 'mobile-only notification box'
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
	);
});

const SideNav = $.memo(() => {
	const [isOpen, setIsOpen] = $.useStateVal(false);
	const activeTab = subActiveTab();
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
					top: '2.5rem',
					left: '25vw',
					zIndex: '20',
				},
				className: 'mobile-only column is-half-mobile'
			},
			!isOpen ? [] : $.div({ className: 'box' }, $(RawSideNav))
		),
		$(Hamburger, { isOpen, onClick: toggle }),
	];
});

const Loading = $.memo(() => $.div(
	{
		style: {
			flex: 1,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '5rem',
			width: '5rem',
			height: '5rem',
			top: 'calc(50% - 2.5rem)',
			left: 'calc(50% - 2.5rem)',
			position: 'absolute',
			zIndex: '10',
		},
		className: 'anim-spin'
	},
	' ⟳ '
));

const PathSelect = $.memo((props) => {
	const label = props.label;
	const placeholder = props.placeholder;
	const onSelect = props.onSelect;
	const value = props.value;
	const isChanged = props.isChanged;
	const currentError = props.currentError;
	const isValidating = props.isValidating;
	const isSuccess = isChanged && !currentError && !isValidating;
	return $.div(
		{ className: 'field' },
		$.label({ className: 'label' }, label),
		$.div(
			{ className: 'field has-addons' },
			$.div(
				{ className: 'control' },
				$.a(
					{
						className: 'button is-primary',
						onClick: () => {
							openFolderSelect(window, onSelect);
						}
					},
					'Select Folder',
				)
			),
			$.div(
				{
					className: 'control has-icons-right',
					style: {
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'stretch',
						flex: '1',
					},
				},
				$.input({
					className: 'input' + isSuccess ? ' is-success' : '',
					style: { flex: '1' },
					type: 'text',
					disabled: true,
					placeholder,
					value,
				}),
				$.span(
					{ className: 'icon is-small is-right' },
					$.i({}, "/"),
				),
			),
		),
	)
});

const Config = $.memo(() => {
	const formStore = $.useRef({ fields: {} });
	const createAppState = $.useCreateAppState();
	const savedData = $.sub(state => ({
		...(state.tabData?.api || {}),
	}));
	const configForm = $.sub(state => ({
		...(state.configForm || { data: {}, validation: {} }),
	}));
	const configData = $.sub(state => ({
		...(state.tabData?.api || {}),
		...(state.configForm?.data || {}),
	}));
	$.useEffect(
		() => {
			// const now = (+(new Date()));
			// for (const field in configData) {
				// const val = configData[field];
				// formStore.current.fields[field] ||= {};
				// formStore.current.fields[field].last = [val, now];
				// if (field === 'ffmpeg') {}
				// state.configForm.validation
			// }
			// createAppState((state) => {
				// state.configForm ||= { data: {}, validation: {} }
				// for (const field in configData) {
					// state.configForm.validation
				// }
			// });
		},
		[configData]
	);
	let areAnyChanged = false;
	let areAnyValidating = false;
	let hasAnyError = false;
	const _isChanged = (field) => !Object.is(
		savedData[field],
		configForm.data[field],
	);
	const _isValidating = (field) => !Object.is(
		configForm.data[field],
		configForm.validation[field]?.value
	);
	const _currentError = (field) => !_isValidating(field) && (
		configForm.validation[field]?.error
	);
	const isChanged = (field) => {
		const res = _isChanged(field);
		areAnyChanged ||= res;
		return res;
	}
	const isValidating = (field) => {
		const res = _isValidating(field);
		areAnyValidating ||= res;
		return res;
	}
	const currentError = (field) => {
		const res = _currentError(field);
		hasAnyError ||= !res;
		return res;
	}
	return $.div(
		{
			className: 'content',
			style: {
				padding: '1rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
				flex: '1',
			},
		},
		$(PathSelect, {
			label: 'slippi root',
			placeholder: 'existing slippi file location',
			value: configData.slippi,
			onSelect: (path) => createAppState((state) => {
				state.configForm ||= { data: {}, validation: {} };
				state.configForm.data.slippi = path;
			}),
			isChanged: isChanged('slippi'),
			isValidating: isValidating('slippi'),
			currentError: currentError('slippi'),
		}),
		$(PathSelect, {
			label: 'recordings folder',
			placeholder: 'newly recorded videos file location',
			value: configData.video,
			onSelect: (path) => createAppState((state) => {
				state.configForm ||= { data: {}, validation: {} };
				state.configForm.data.video = path;
			}),
			isChanged: isChanged('video'),
			isValidating: isValidating('video'),
			currentError: currentError('video'),
		}),
		$(PathSelect, {
			label: 'ffmpeg install folder',
			placeholder: (
				'existing ffmpeg binary location (can leave blank if on path)'
			),
			value: configData.ffmpeg,
			onSelect: (path) => createAppState((state) => {
				state.configForm ||= { data: {}, validation: {} };
				state.configForm.data.ffmpeg = path;
			}),
			isChanged: isChanged('ffmpeg'),
			isValidating: isValidating('ffmpeg'),
			currentError: currentError('ffmpeg'),
		}),
	);
});
const Sources = $.memo(() => 'Sources...');
const Processors = $.memo(() => 'Processors...');
const Workers = $.memo(() => 'Workers...');
const Highlights = $.memo(() => 'Highlights...');

const Body = $.memo(() => {
	const api = $.useApi();

	const tab = $.sub(state => ({
		name: state.activeTab || 'loading',
		data: state.tabData,
	}));
	const isLoading = !tab.data.isDone;
	const tabName = isLoading ? 'loading' : tab.name;
	console.log('tabName', tabName)

	const className = (
		'column is-10-full-hd is-10-widescreen is-two-thirds-tablet'
	);

	return $.div(
		{
			key: tab.name,
			className,
			style: {
				padding: '0.5rem 0.75rem 0 0.75rem',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
			}
		},
		$(Hamburger, { isHidden: true }),
		$(({
			loading: Loading,
			config: Config,
			sources: Sources,
			processors: Processors,
			workers: Workers,
			highlights: Highlights,
		})[tabName]),
	);
});

const Container = $.memo(() => {
	return $.div({ className: 'columns' }, $(SideNav), $(Body));
});

const NO_TAB_DATA = { isDone: false };

let nextRerenderId = 1;
const useRerender = () => {
	const [_, setVal] = $.useStateVal(nextRerenderId++);
	return () => setVal(nextRerenderId++);
};

const timeout = (ms) => new Promise((done) => setTimeout(done, ms));

const App = $.memo((statics) => {
	const rerender = useRerender();
	const [appState, createAppState] = $.useState(
		{ statics, tabData: NO_TAB_DATA }
	);
	const apiReqId = appState.apiReqId;
	const apiStore = $.useRef({ nextId: 1, results: {} });
	console.log('reqIds', apiReqId, apiStore.current.apiReqId)
	const tabData = (
		apiStore.current.apiReqId === apiReqId && apiStore.current.results[apiReqId]
	 ) || NO_TAB_DATA;
	$.useEffect(
		() => {
			createAppState((state) => { state.tabData = tabData });
		},
		[tabData]
	);
	const url = `${statics.hostname}:${statics.port}`;
	const activeTab = appState.activeTab || 'config';
	console.log('activeTab', activeTab)
	const api = $.useCallback(
        async (...args) => {
            try {
                const res = await fetch(url + "/api", {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(args),
                })
                return await res.json();
            } catch (error) {
                return { error };
            }
        },
        [url]
    );
	$.useEffect(
		() => {
			const reqId = apiStore.current.nextId++;
			console.log('reqId', reqId)
			apiStore.current.results[reqId] = { isDone: false };
			apiStore.current.apiReqId = reqId;
			createAppState((state) => {
				state.apiReqId = reqId;
				state.activeTab = activeTab;
			});
			(async () => {
				const args = [activeTab];
				try {
					const [res] = await Promise.all([
						fetch(url + "/api", {
							method: 'POST',
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(args),
						}),
						timeout(300),
					]);
					const serverData = await res.json();
					apiStore.current.results = {
						[reqId]: { isDone: true, args, ...serverData }
					};
				} catch (error) {
					apiStore.current.results = {
						[reqId]: { isDone: true, args, error }
					};
				}
				rerender();
			})();
		},
		[activeTab]
	);
	return $(
		$.AppContext.Provider,
		{ value: { appState, createAppState, api } },
		$(Container)
	);
});

const handleLaunch = (statics) => {
	$.render($(App, statics), document.getElementById('app'));
};

const waitOnStatic = async (onStatic) => {
	while (!window['slp-db-static']) {
		await timeout(500);
	}
	return onStatic(window['slp-db-static']);
};

export const launch = () => waitOnStatic(handleLaunch);