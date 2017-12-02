import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

import {AppSettings} from 'app/AppSettings'
import {AppReducer, TAppState} from 'app/domain/AppReducer'

import Desktop from 'app/controller/Desktop'

import 'styles/App.css'

const APP_STATE_LS_KEY = 'zen-tab-app-state'

class App extends React.PureComponent {

	store: any = null

	constructor (props: any) {
		super(props)
		this.initStore()
	}

	initStore = () => {
		const logger = createLogger(AppSettings.REDUX_LOGGER_SETTINGS)
		const middleware = applyMiddleware(thunk, logger)
		const previousState = this.loadAppState()
		this.store = createStore(AppReducer, previousState, middleware)
		this.store.subscribe(this.saveAppState)
	}

	loadAppState = (): TAppState => {
		const appState = localStorage.getItem(APP_STATE_LS_KEY)
		return (appState) ? JSON.parse(appState) : undefined
	}

	saveAppState = () => {
		const state = this.store.getState()
		localStorage.setItem(APP_STATE_LS_KEY, JSON.stringify(state))
	}

	render () {
		return (
			<Provider store={this.store}>
				<Desktop/>
			</Provider>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('root') as HTMLElement)
