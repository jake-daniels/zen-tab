import React from 'react'

import {withState} from 'app/store/connect'
import * as Actions from 'app/store/actions'

import Keyboard from 'app/domain/keyboard'
import Link, {LinkDropSpot} from 'app/view/Link'


const LINKS_CHECK_INTERVAL = 3000

interface IOwnProps {}
interface IStateProps {
	links: ILink[],
}
interface IProps extends IOwnProps, IStateProps {}
interface IState {
	dragMode: boolean,
	dropSpotOrder: number,
	draggedItem: any,
}

@withState<IOwnProps, IStateProps>(
	(store: IStore) => ({
		links: store.links,
	})
)
class QuickLinks extends React.PureComponent<IProps, IState> {

	private pendingLinksTimer: number = 0

	public state: IState = {
		dragMode: false,
		dropSpotOrder: -1,
		draggedItem: null,
	}

	public componentDidMount () {
		this.pendingLinksTimer = window.setInterval(this.savePendingLinks, LINKS_CHECK_INTERVAL)
		this.savePendingLinks()

		Keyboard.subscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.subscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	public componentWillUnmount () {
		window.clearInterval(this.pendingLinksTimer)

		Keyboard.unsubscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.unsubscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	private savePendingLinks = () => {
		const tmpStoreEncoded = localStorage.getItem('what')
		const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}

		if (Array.isArray(tmpStore.linksToSave)) {
			tmpStore.linksToSave.forEach((link: any) => {
				Actions.createLink(link.title, link.url)
			})
			tmpStore.linksToSave = []
			localStorage.setItem('what', JSON.stringify(tmpStore))
		}
	}

	private linkDeleted = (id: string) => {
		Actions.deleteLink(id)
	}

	// Drag & Drop

	private activateDragMode = () => this.setState({dragMode: true})

	private deactivateDragMode = () => this.setState({dragMode: false})

	private showDropSpot = (draggedItem: any, dropSpotOrder: number) => this.setState({draggedItem, dropSpotOrder})

	private dropItem = () => {
		const {draggedItem, dropSpotOrder} = this.state
		Actions.reorderLinks(draggedItem.link, dropSpotOrder)
		this.setState({draggedItem: null, dropSpotOrder: -1})
	}

	// Render

	public render () {
		const {dragMode, draggedItem, dropSpotOrder} = this.state

		let links = this.props.links

		// create link components
		if (draggedItem !== null) {
			links = links.filter((link) => link.position !== draggedItem.link.position)
		}

		const items = links.map((link) => {
			return (
				<Link
					key={link.id}
					dragMode={dragMode}
					link={link}
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

export default QuickLinks as React.ComponentType<IOwnProps>
