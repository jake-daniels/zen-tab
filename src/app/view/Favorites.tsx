import React from 'react'

import {FavoritesConfig} from 'app/domain/favorites-config'
import BookmarkIcon from 'app/view/BookmarkIcon'

export default class Favorites extends React.PureComponent {

	public render () {
		return (
			<div className='bookmarks-panel'>
				{FavoritesConfig.map((bookmark, i) =>
					<BookmarkIcon key={i} {...bookmark} />)
				}
			</div>
		)
	}
}
