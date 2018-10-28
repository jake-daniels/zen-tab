
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {CustomDragLayer} from 'app/domain/drag-and-drop'
import ErrorBoundary from 'app/view/ErrorBoundary'
import Favorites from 'app/view/Favorites'
import QuickLinks from 'app/view/QuickLinks'
import Clock from 'app/view/components/Clock'


@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {

	componentDidMount () {
		chrome.bookmarks.getTree((result) => console.log(result))
		// https://www.google.com/s2/favicons?domain=https://toggl.com/app/timer
	}

	render () {
		return (
			<ErrorBoundary>
				<div className='desktop'>
					<Favorites/>
					<QuickLinks/>
					<Clock/>
					<CustomDragLayer/>
				</div>
			</ErrorBoundary>
		)
	}
}
