
import React from 'react'
import ReactDOM from 'react-dom'


import {AppSettings} from 'app/AppSettings'

import Desktop from 'app/controller/Desktop'

import 'styles/App.css'
import './globals'

class App extends React.Component {

	store: any = null

	constructor (props: any) {
		super(props)
		this.initStore()
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
