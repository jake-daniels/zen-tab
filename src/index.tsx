
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Immutable from 'immutable'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

import {AppSettings} from 'app/AppSettings'
import {AppReducer, TAppState} from 'app/domain/AppReducer'

import Desktop from 'app/controller/Desktop'

import 'styles/App.css'

// GLOBALS

function cn (def: Object) {
	let result = ''
	Object.keys(def).forEach((key) => {
		const value = def[key]
		if (value) {
			result += ` ${key}`
		}
	})
	return result
}

const _global = (window || global) as any
_global.cn = cn
_global.I = Immutable

class App extends React.Component {

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
		const appState = localStorage.getItem(AppSettings.LS_KEYS.AppState)
		return (appState) ? JSON.parse(appState) : undefined
	}

	saveAppState = () => {
		const state = this.store.getState()
		localStorage.setItem(AppSettings.LS_KEYS.AppState, JSON.stringify(state))
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
