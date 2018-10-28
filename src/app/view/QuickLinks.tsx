
import React from 'react'

import Keyboard from 'app/domain/keyboard'

import Link, {LinkDropSpot} from 'app/view/components/Link'

const LINKS_CHECK_INTERVAL = 3000

interface IState {
	dragMode: boolean,
	dropSpotOrder: number,
	draggedItem: any,
}


export default class QuickLinks extends React.PureComponent<any, IState> {

	state: IState = {
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
		const tmpStoreEncoded = localStorage.getItem('what')
		const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}

		if (Array.isArray(tmpStore.linksToSave)) {
			tmpStore.linksToSave.forEach((link: any) => {
				this.props.createLink(link.title, link.url)
			})
			tmpStore.linksToSave = []
			localStorage.setItem('what', JSON.stringify(tmpStore))
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
		let links: any = []

		// create link components
		if (draggedItem !== null) {
			links = links.filter((link: any) => link.order !== draggedItem.link.order)
		}
		let items = links.map((link: any) => {
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
