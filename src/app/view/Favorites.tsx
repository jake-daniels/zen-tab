import React from 'react'
import UUID from 'shortid'

import BookmarkDetail from 'app/view/BookmarkDetail'
import {withState} from 'app/store/connect'
import * as Actions from 'app/store/actions'

const DATA = [
	{title: 'Home - Chess.com', url: 'https://www.chess.com/home'},
	{title: 'YouTube', url: 'https://www.youtube.com/'},
	{title: 'TypeScript 3.0', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html'},
]

interface IOwnProps {}
interface IStateProps {
	bookmarks: ILink[],
}
interface IProps extends IOwnProps, IStateProps {}
interface IState {
	openBookmark: ILink | null
}

@withState<IOwnProps, IStateProps>(
	(store: IStore) => ({
		bookmarks: store.bookmarks,
	})
)
class Favorites extends React.PureComponent<IProps, IState> {

	public state: IState = {
		openBookmark: null
	}

	// public componentDidMount () {
	// 	// const src = ''

	// 	const data = DATA.map((x) => {
	// 		const origin = URI(x.url).origin()
	// 		//const icon = `${origin}/favicon.ico`
	// 		const icon = `https://www.google.com/s2/favicons?domain_url=${x.url}`
	// 		return {...x, icon}
	// 	})

	// 	this.setState({data})
	// }

	private addBookmark = () => {
		const bookmark = {
			id: UUID.generate(),
			position: -1,
			title: '',
			url: '',
		} as ILink
		this.setState({openBookmark: bookmark})
	}

	private saveBookmark = (bookmark: ILink) => {
		Actions.addBookmark(bookmark)
		this.setState({openBookmark: null})
	}

	private closeDetail = () => {
		this.setState({openBookmark: null})
	}

	private Bookmark = ({title, url}: ILink) => {
		const icon = `https://www.google.com/s2/favicons?domain_url=${url}`
		return (
			<div className='bookmark'>
				<img src={icon} />
				<span className='title'>{title}</span>
			</div>
		)
	}

	public render () {
		const {bookmarks} = this.props
		const {openBookmark} = this.state

		return (
			<div className='bookmarks-panel'>
				<div className='list'>
					{bookmarks.map((bookmark) => {
						return <this.Bookmark key={bookmark.id} {...bookmark} />
					})}
				</div>
				<div className='add-button' onClick={this.addBookmark}>
					<i className='fas fa-plus-circle' />
				</div>
				{openBookmark &&
					<BookmarkDetail
						bookmark={openBookmark!}
						onSave={this.saveBookmark}
						onCancel={this.closeDetail}
					/>
				}
			</div>
		)
	}
}

export default Favorites as React.ComponentType<IOwnProps>
