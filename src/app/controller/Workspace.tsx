import * as React from 'react'
import {BookmarksConfig} from 'app/Bookmarks'
import BookmarkIcon from 'app/view/BookmarkIcon'

export default class Workspace extends React.PureComponent {
	render () {
		return (
			<div className='workspace'>
				{BookmarksConfig.map((bookmark, i) => <BookmarkIcon key={i} {...bookmark}/>)}
			</div>
		)
	}
}
