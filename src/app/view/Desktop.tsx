
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {CustomDragLayer} from 'app/domain/drag-and-drop'
import Clock from 'app/view/Clock'
import ErrorBoundary from 'app/view/ErrorBoundary'
import Favorites from 'app/view/Favorites'
import QuickLinks from 'app/view/QuickLinks'


@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {

	public render () {
		return (
			<ErrorBoundary>
				<div className='desktop'>
					<QuickLinks />
					<Favorites />
					<Clock />
					<CustomDragLayer />
				</div>
			</ErrorBoundary>
		)
	}
}
