
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {CustomDragLayer} from 'app/domain/drag-and-drop'
import Clock from 'app/view/components/Clock'
import ErrorBoundary from 'app/view/ErrorBoundary'
import Favorites from 'app/view/Favorites'
import QuickLinks from 'app/view/QuickLinks'


@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {

	// public componentDidMount () {
	// 	chrome.bookmarks.getTree((result) => console.log(result))
	// 	// https://www.google.com/s2/favicons?domain=https://toggl.com/app/timer
	// }

	public render () {
		return (
			<ErrorBoundary>
				<div className='desktop'>
					{/* <QuickLinks /> */}
					<Favorites />
					<Clock />
					{/* <CustomDragLayer /> */}
				</div>
			</ErrorBoundary>
		)
	}
}
