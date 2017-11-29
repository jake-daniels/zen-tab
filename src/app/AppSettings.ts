
export const AppSettings = {

	// options settings for redux-logger middleware
	REDUX_LOGGER_SETTINGS: {
		level: 'log',
		duration: false,
		timestamp: true,
		colors: {
			title: (action: any) => '#262626',
			prevState: (prevState: any) => 'SteelBlue',
			action: (action: any) => 'DarkViolet',
			nextState: (nextState: any) => 'Green',
			error: (error: any) => 'Crimson',
		},
		logger: console,
		logErrors: true,
		collapsed: true,
	},

}
