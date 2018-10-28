import 'styles/index.css'
import 'app/globals'

import React from 'react'
import ReactDOM from 'react-dom'
import Desktop from 'app/view/Desktop'
import {provideState} from 'app/store/connect'

@provideState({log: true, hydrate: true})
class App extends React.Component {

	public render () {
		return (
			<Desktop />
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
