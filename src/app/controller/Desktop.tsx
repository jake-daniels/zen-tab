
import * as React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import BookmarksBar from 'app/controller/BookmarksBar'
import Workspace from 'app/controller/Workspace'

@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {
	render () {
		return (
			<div className='desktop'>
				<BookmarksBar/>
				<Workspace/>
			</div>
		)
	}
}
