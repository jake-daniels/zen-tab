
import * as React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import BookmarksPanel from 'app/controller/BookmarksPanel'
import NotesPanel from 'app/controller/NotesPanel'
import LinksPanel from 'app/controller/LinksPanel'
import Clock from 'app/view/Clock'


@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {

	render () {
		return (
			<div className='desktop'>
				<BookmarksPanel/>
				<LinksPanel/>
				<NotesPanel/>
				<Clock/>
			</div>
		)
	}

}
