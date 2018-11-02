import React from 'react'
import UUID from 'shortid'
import Keyboard from 'app/domain/keyboard'
import Bookmark, {BookmarkDropSpot} from 'app/view/Bookmark'
import BookmarkDetail from 'app/view/BookmarkDetail'


function generateBookmark () {
	return {
		id: UUID.generate(),
		position: -1,
		title: '',
		url: '',
	} as ILink
}

interface IProps {
	type: EBookmarkType,
	bookmarks: ILink[],
	saveBookmark: (bookmark: ILink) => void,
	deleteBookmark: (id: string) => void,
	reorderBookmarks: (source: ILink, newPosition: number) => void,
}
interface IState {
	openBookmark: ILink | null,
	dragMode: boolean,
	dropSpotOrder: number,
	draggedItem: any,
}

export default class Bookmarks extends React.PureComponent<IProps, IState> {

	public state: IState = {
		openBookmark: null,
		dragMode: false,
		dropSpotOrder: -1,
		draggedItem: null,
	}

	public componentDidMount () {
		Keyboard.subscribe(Keyboard.Events.SHIFT_DOWN, this.activateDragMode)
		Keyboard.subscribe(Keyboard.Events.SHIFT_UP, this.deactivateDragMode)
	}

	public componentWillUnmount () {
		Keyboard.unsubscribe(Keyboard.Events.SHIFT_DOWN, this.activateDragMode)
		Keyboard.unsubscribe(Keyboard.Events.SHIFT_UP, this.deactivateDragMode)
	}

	private addBookmark = () => {
		const bookmark = generateBookmark()
		this.setState({openBookmark: bookmark})
	}

	private deleteBookmark = (id: string) => {
		this.props.deleteBookmark(id)
	}

	private editBookmark = (id: string) => {
		const bookmark = this.props.bookmarks.find((x) => x.id === id) as ILink
		this.setState({openBookmark: bookmark})
	}

	private saveBookmark = (bookmark: ILink) => {
		this.props.saveBookmark(bookmark)
		this.setState({openBookmark: null})
	}

	private closeDetail = () => {
		this.setState({openBookmark: null})
	}

	// Drag & Drop

	private activateDragMode = () => this.setState({dragMode: true})

	private deactivateDragMode = () => this.setState({dragMode: false})

	private showDropSpot = (draggedItem: ILink, dropSpotOrder: number) => this.setState({draggedItem, dropSpotOrder})

	private dropItem = () => {
		const {draggedItem, dropSpotOrder} = this.state
		this.props.reorderBookmarks(draggedItem.link, dropSpotOrder)
		this.setState({draggedItem: null, dropSpotOrder: -1})
	}

	// Render

	public render () {
		const {openBookmark} = this.state
		const {dragMode, draggedItem, dropSpotOrder} = this.state

		let bookmarks = this.props.bookmarks

		// create link components
		if (draggedItem !== null) {
			bookmarks = bookmarks.filter((bookmark) => bookmark.position !== draggedItem.link.position)
		}

		const items = bookmarks.map((bookmark) => {
			return (
				<Bookmark
					key={bookmark.id}
					link={bookmark}
					onEdit={this.editBookmark}
					onDelete={this.deleteBookmark}
					dragMode={dragMode}
					showDropSpot={this.showDropSpot}
					drop={this.dropItem}
				/>
			)
		})

		// insert drop spot
		if (dropSpotOrder !== -1) {
			const DropSpotComponent = (
				<BookmarkDropSpot
					key='drop-spot'
					height={draggedItem.clientRect.height}
					isDropSpot={true}
					drop={this.dropItem}
				/>
			)
			items.splice(dropSpotOrder, 0, DropSpotComponent)
		}

		return (
			<div className='panel bookmarks-panel'>

				<div className='panel-title'>
					<h2> {this.props.type} </h2>
					<div className='add-button' onClick={this.addBookmark}>
						<i className='fas fa-plus-circle' />
					</div>
				</div>

				<div className='list'>
					{items}
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
