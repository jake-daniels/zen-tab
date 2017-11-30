
import * as React from 'react'

import BookmarksBar from 'app/view/BookmarksBar'
import Workspace from 'app/view/Workspace'

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
