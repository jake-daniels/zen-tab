
import React from 'react'
import ReactDOM from 'react-dom'


import {AppSettings} from 'app/domain/app-settings'

import Desktop from 'app/view/Desktop'

import 'styles/App.css'
import './globals'

class App extends React.Component {

	// initStore = () => {
	// 	const logger = createLogger(AppSettings.REDUX_LOGGER_SETTINGS)
	// 	const middleware = applyMiddleware(thunk, logger)
	// 	const previousState = this.loadAppState()
	// 	this.store = createStore(AppReducer, previousState, middleware)
	// 	this.store.subscribe(this.saveAppState)
	// }

	// loadAppState = (): TAppState => {
	// 	const appState = localStorage.getItem(AppSettings.LS_KEYS.AppState)
	// 	return (appState) ? JSON.parse(appState) : undefined
	// }

	// saveAppState = () => {
	// 	const state = this.store.geIState()
	// 	localStorage.setItem(AppSettings.LS_KEYS.AppState, JSON.stringify(state))
	// }

	render () {
		return (
			<Desktop />
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('root') as HTMLElement)
