import * as React from 'react'

import {BookmarksConfig} from 'app/Bookmarks'
import BookmarkIcon from 'app/view/BookmarkIcon'

type TProps = any

export default class BookmarksBar extends React.PureComponent<TProps> {

	render () {
		return (
			<div className='bookmarks-bar'>
				{BookmarksConfig.map((bookmark, i) => <BookmarkIcon key={i} {...bookmark}/>)}
			</div>
		)
	}
}
