
import * as React from 'react'
import {connect} from 'react-redux'

import Keyboard from 'app/domain/Keyboard'
import * as LinksActions from 'app/domain/LinksActions'
import * as Selectors from 'app/domain/Selectors'
import {AppSettings} from 'app/AppSettings'

import Link, {LinkDropSpot} from 'app/view/Link'

const LINKS_CHECK_INTERVAL = 3000

interface TState {
	dragMode: boolean,
	dropSpotOrder: number,
	draggedItem: any,
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
		dropSpotOrder: -1,
		draggedItem: null,
	}

	pendingLinksTimer: number = 0

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

	// Drag & Drop

	activateDragMode = () => this.setState({dragMode: true})

	deactivateDragMode = () => this.setState({dragMode: false})

	showDropSpot = (draggedItem: any, dropSpotOrder: number) => this.setState({draggedItem, dropSpotOrder})

	dropItem = () => {
		const {draggedItem, dropSpotOrder} = this.state
		const {reorderLinks} = this.props

		reorderLinks(draggedItem.link, dropSpotOrder)
		this.setState({draggedItem: null, dropSpotOrder: -1})
	}

	// Render

	render () {
		const {dragMode, draggedItem, dropSpotOrder} = this.state
		let {links} = this.props

		// create link components
		if (draggedItem !== null) {
			links = links.filter((link) => link.order !== draggedItem.link.order)
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
					drop={this.dropItem}
				/>
			)
		})

		// insert drop spot
		if (dropSpotOrder !== -1) {
			const DropSpotComponent = (
				<LinkDropSpot
					key='link-drop-spot'
					height={draggedItem.clientRect.height}
					isDropSpot={true}
					drop={this.dropItem}
				/>
			)
			items.splice(dropSpotOrder, 0, DropSpotComponent)
		}

		return (
			<div className='links-panel'>
				{items}
			</div>
		)
	}
}
