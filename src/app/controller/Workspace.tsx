
import * as React from 'react'

import Clock from 'app/view/Clock'
import NotesBoard from 'app/controller/NotesBoard'

export default class Workspace extends React.PureComponent {

	render () {
		return (
			<div className='workspace'>
				<NotesBoard/>
				<Clock/>
			</div>
		)
	}
}
