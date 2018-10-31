
import React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {withState} from 'app/store/connect'
import * as Actions from 'app/store/actions'

import {CustomDragLayer} from 'app/domain/drag-and-drop'
import Clock from 'app/view/Clock'
import Bookmarks from 'app/view/Bookmarks'
import QuickLinks from 'app/view/QuickLinks'


interface IOwnProps {}
interface IStateProps {
	links: ILink[],
	personalBookmarks: ILink[],
	workBookmarks: ILink[],
	ui: IUi,
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

	private saveBookmark = (type: EBookmarkType) => (bookmark: ILink) => {
		Actions.saveBookmark(type, bookmark)
	}

	private deleteBookmark = (type: EBookmarkType) => (id: string) => {
		Actions.deleteBookmark(type, id)
	}

	private reorderBookmarks = (type: EBookmarkType) => (source: ILink, newPosition: number) => {
		Actions.reorderBookmarks(type, source, newPosition)
	}

	public render () {
		const {links, personalBookmarks, workBookmarks, ui} = this.props

		return (
			<div className='desktop'>

				<QuickLinks
					links={links}
					createLink={this.createLink}
					deleteLink={this.deleteLink}
					reorderLinks={this.reorderLinks}
				/>

				<Bookmarks
					type={EBookmarkType.Personal}
					bookmarks={personalBookmarks}
					saveBookmark={this.saveBookmark(EBookmarkType.Personal)}
					deleteBookmark={this.deleteBookmark(EBookmarkType.Personal)}
					reorderBookmarks={this.reorderBookmarks(EBookmarkType.Personal)}
				/>

				<Bookmarks
					type={EBookmarkType.Work}
					bookmarks={workBookmarks}
					saveBookmark={this.saveBookmark(EBookmarkType.Work)}
					deleteBookmark={this.deleteBookmark(EBookmarkType.Work)}
					reorderBookmarks={this.reorderBookmarks(EBookmarkType.Work)}
				/>

				<Clock />

				<CustomDragLayer />

			</div>
		)
	}
}

export default Desktop as React.ComponentType<IOwnProps>
