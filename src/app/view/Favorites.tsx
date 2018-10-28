
import React from 'react'

import {FavoritesConfig} from 'app/domain/favorites-config'
import BookmarkIcon from 'app/view/components/BookmarkIcon'


export default class Favorites extends React.PureComponent {

	render () {
		return (
			<div className='bookmarks-panel'>
				{FavoritesConfig.map((bookmark, i) => {
					return (
						<BookmarkIcon key={i} {...bookmark}/>
					)
				})}
			</div>
		)
	}
}
