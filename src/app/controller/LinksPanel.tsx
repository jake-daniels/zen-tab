
import * as React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import Keyboard from 'app/domain/Keyboard'
import * as T from 'app/domain/Types'
import * as LinksActions from 'app/domain/LinksActions'
import * as Selectors from 'app/domain/Selectors'
import {AppSettings} from 'app/AppSettings'
import {LinkDropTarget, CustomDragLayer} from 'app/domain/drag-and-drop'

import Link from 'app/view/Link'

const LINKS_CHECK_INTERVAL = 3000

interface TState {
	dragMode: boolean,
	dropSpotPosition: number,
	draggedLinkOrder: number,
	draggedLinkClientRect: any,
}

@LinkDropTarget()
class LinkDropSpot extends React.PureComponent<any> {

	render () {
		const {connectDropTarget, height} = this.props

		return connectDropTarget(
			<div className='link-drop-spot' style={{height}}>
				Drop here
			</div>
		)
	}

}

@(connect as any)(
	(state) => {
		return {
			links: Selectors.getLinks(state),
		}
	},
	{
		createLink: LinksActions.createLink,
		deleteLink: LinksActions.deleteLink,
		updateLink: LinksActions.updateLink,
		reorderLinks: LinksActions.reorderLinks,
	},
)
export default class LinksPanel extends React.PureComponent<any, TState> {

	state: TState = {
		dragMode: false,
		dropSpotPosition: -1,
		draggedLinkClientRect: null,
		draggedLinkOrder: -1,
	}

	pendingLinksTimer: number = 0

	activateDragMode = () => this.setState({dragMode: true})

	deactivateDragMode = () => this.setState({dragMode: false})

	componentDidMount () {
		this.pendingLinksTimer = window.setInterval(this.savePendingLinks, LINKS_CHECK_INTERVAL)
		this.savePendingLinks()

		Keyboard.subscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.subscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	componentWillUnmount () {
		window.clearInterval(this.pendingLinksTimer)

		Keyboard.unsubscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.unsubscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	savePendingLinks = () => {
		const tmpStoreEncoded = localStorage.getItem(AppSettings.LS_KEYS.TmpStore)
		const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}

		if (Array.isArray(tmpStore.linksToSave)) {
			tmpStore.linksToSave.forEach((link) => {
				this.props.createLink(link.title, link.url)
			})
			tmpStore.linksToSave = []
			localStorage.setItem(AppSettings.LS_KEYS.TmpStore, JSON.stringify(tmpStore))
		}
	}

	titleChanged = (id: string, title: string) => {
		this.props.updateLink(id, {title})
	}

	linkDeleted = (id: string) => {
		this.props.deleteLink(id)
	}

	showDropSpot = (dropSpotPosition: number, draggedLinkClientRect: any, draggedLinkOrder) => {
		this.setState({dropSpotPosition, draggedLinkClientRect, draggedLinkOrder})
	}

	dropLink = (link: T.Link) => {
		const {dropSpotPosition} = this.state
		this.props.reorderLinks(link, dropSpotPosition)
		this.setState({
			dropSpotPosition: -1,
			draggedLinkClientRect: null,
		})
	}

	render () {
		const {dragMode, dropSpotPosition, draggedLinkClientRect, draggedLinkOrder} = this.state

		let links = List<T.Link>(this.props.links) as any

		if (dropSpotPosition !== -1) {
			links = links.filterNot((link) => link.order === draggedLinkOrder)
		}

		let items = links.map((link) => {
			return (
				<Link
					key={link.id}
					dragMode={dragMode}
					link={link}
					onTitleChange={this.titleChanged}
					onDelete={this.linkDeleted}
					showDropSpot={this.showDropSpot}
					drop={this.dropLink}
				/>
			)
		})

		if (dropSpotPosition !== -1) {
			const {height} = draggedLinkClientRect
			const DropSpotComponent = (
				<LinkDropSpot
					isDropSpot={true}
					key='link-drop-spot'
					height={height}
					link={{order: dropSpotPosition}}
					showDropSpot={this.showDropSpot}
					drop={this.dropLink}
				/>
			)
			items = items.splice(dropSpotPosition, 0, DropSpotComponent)
		}

		return (
			<div className='links-panel'>
				{items.toArray()}
				<CustomDragLayer/>
			</div>
		)
	}
}
