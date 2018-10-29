
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {withState} from 'app/store/connect'
import * as Actions from 'app/store/actions'

import {CustomDragLayer} from 'app/domain/drag-and-drop'
import Clock from 'app/view/Clock'
import ErrorBoundary from 'app/view/ErrorBoundary'
import Bookmarks from 'app/view/Bookmarks'
import QuickLinks from 'app/view/QuickLinks'


interface IOwnProps {}
interface IStateProps {
	links: ILink[],
	personalBookmarks: ILink[],
	workBookmarks: ILink[],
}
interface IProps extends IOwnProps, IStateProps {}


@DragDropContext(HTML5Backend)
@withState<IOwnProps, IStateProps>(
	(store: IStore) => ({
		links: store.links,
		personalBookmarks: store.bookmarks[EBookmarkType.Personal],
		workBookmarks: store.bookmarks[EBookmarkType.Work],
	})
)
class Desktop extends React.PureComponent<IProps> {

	private createLink = (title: string, url: string) => {
		Actions.createLink(title, url)
	}

	private deleteLink = (id: string) => {
		Actions.deleteLink(id)
	}

	private reorderLinks = (source: ILink, newPosition: number) => {
		Actions.reorderLinks(source, newPosition)
	}

	private addBookmark = (type: EBookmarkType) => (bookmark: ILink) => {
		Actions.addBookmark(type, bookmark)
	}

	private deleteBookmark = (type: EBookmarkType) => (id: string) => {
		Actions.deleteBookmark(type, id)
	}

	private reorderBookmarks = (type: EBookmarkType) => (source: ILink, newPosition: number) => {
		Actions.reorderBookmarks(type, source, newPosition)
	}

	public render () {
		const {links, personalBookmarks, workBookmarks} = this.props

		return (
			<ErrorBoundary>
				<div className='desktop'>
					<QuickLinks
						links={links}
						createLink={this.createLink}
						deleteLink={this.deleteLink}
						reorderLinks={this.reorderLinks}
					/>
					<div className='separator' />

					<Bookmarks
						type={EBookmarkType.Personal}
						bookmarks={personalBookmarks}
						addBookmark={this.addBookmark(EBookmarkType.Personal)}
						deleteBookmark={this.deleteBookmark(EBookmarkType.Personal)}
						reorderBookmarks={this.reorderBookmarks(EBookmarkType.Personal)}
						/>
					<div className='separator' />

					<Bookmarks
						type={EBookmarkType.Work}
						bookmarks={workBookmarks}
						addBookmark={this.addBookmark(EBookmarkType.Work)}
						deleteBookmark={this.deleteBookmark(EBookmarkType.Work)}
						reorderBookmarks={this.reorderBookmarks(EBookmarkType.Work)}
					/>
					<div className='separator' />

					<Clock />
					<CustomDragLayer />
				</div>
			</ErrorBoundary>
		)
	}
}

export default Desktop as React.ComponentType<IOwnProps>
