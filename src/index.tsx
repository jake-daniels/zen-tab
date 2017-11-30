import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

import {AppSettings} from 'app/AppSettings'
import {AppReducer} from 'app/domain/AppReducer'

import Desktop from 'app/controller/Desktop'

import 'styles/App.css'

class App extends React.PureComponent {

	store: any = null

	constructor (props: any) {
		super(props)
		this.initStore()
	}

	initStore = () => {
		const logger = createLogger(AppSettings.REDUX_LOGGER_SETTINGS)
		const middleware = applyMiddleware(thunk, logger)
		this.store = createStore(AppReducer, middleware)
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
