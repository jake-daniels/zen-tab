
import * as React from 'react'

import {BookmarksConfig} from 'app/Bookmarks'
import BookmarkIcon from 'app/view/BookmarkIcon'


export default class BookmarksPanel extends React.PureComponent {

	render () {
		return (
			<div className='bookmarks-panel'>
				{BookmarksConfig.map((bookmark, i) => {
					return (
						<BookmarkIcon key={i} {...bookmark}/>
					)
				})}
			</div>
		)
	}
}
