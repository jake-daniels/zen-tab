import 'styles/index.css'
import 'app/globals'

import React from 'react'
import ReactDOM from 'react-dom'
import Desktop from 'app/view/Desktop'
import ErrorBoundary from 'app/view/ErrorBoundary'
import {provideState} from 'app/store/connect'

@provideState({log: true, hydrate: true})
class App extends React.Component {

	public render () {
		return (
			<ErrorBoundary>
				<Desktop />
			</ErrorBoundary>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
