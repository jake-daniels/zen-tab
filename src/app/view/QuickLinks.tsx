import React from 'react'
import Keyboard from 'app/domain/keyboard'
import Link, {LinkDropSpot} from 'app/view/Link'

const LINKS_CHECK_INTERVAL = 3000

interface IProps {
	links: ILink[],
	createLink: (title: string, url: string) => void,
	deleteLink: (id: string) => void,
	reorderLinks: (source: ILink, newPosition: number) => void,
}
interface IState {
	dragMode: boolean,
	dropSpotOrder: number,
	draggedItem: any,
}

export default class QuickLinks extends React.PureComponent<IProps, IState> {

	private pendingLinksTimer: number = 0

	public state: IState = {
		dragMode: false,
		dropSpotOrder: -1,
		draggedItem: null,
	}

	public componentDidMount () {
		window.setTimeout(() => {
			this.pendingLinksTimer = window.setInterval(this.savePendingLinks, LINKS_CHECK_INTERVAL)
			this.savePendingLinks()
		}, 0)

		Keyboard.subscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.subscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	public componentWillUnmount () {
		window.clearInterval(this.pendingLinksTimer)

		Keyboard.unsubscribe(Keyboard.Events.CONTROL_DOWN, this.activateDragMode)
		Keyboard.unsubscribe(Keyboard.Events.CONTROL_UP, this.deactivateDragMode)
	}

	private savePendingLinks = () => {
		const tmpStoreEncoded = localStorage.getItem('zen-tab-tmp')
		const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}

		if (Array.isArray(tmpStore.linksToSave)) {
			tmpStore.linksToSave.forEach((link: {title: string, url: string}) => {
				this.props.createLink(link.title, link.url)
			})
			tmpStore.linksToSave = []
			localStorage.setItem('zen-tab-tmp', JSON.stringify(tmpStore))
		}
	}

	// Drag & Drop

	private activateDragMode = () => this.setState({dragMode: true})

	private deactivateDragMode = () => this.setState({dragMode: false})

	private showDropSpot = (draggedItem: any, dropSpotOrder: number) => this.setState({draggedItem, dropSpotOrder})

	private dropItem = () => {
		const {draggedItem, dropSpotOrder} = this.state
		this.props.reorderLinks(draggedItem.link, dropSpotOrder)
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
					onDelete={this.props.deleteLink}
					showDropSpot={this.showDropSpot}
					drop={this.dropItem}
				/>
			)
		})

		// insert drop spot
		if (dropSpotOrder !== -1) {
			const DropSpotComponent = (
				<LinkDropSpot
					key='drop-spot'
					height={draggedItem.clientRect.height}
					isDropSpot={true}
					drop={this.dropItem}
				/>
			)
			items.splice(dropSpotOrder, 0, DropSpotComponent)
		}

		return (
			<div className='panel links-panel'>
				<div className='panel-title'>
					<h2>Quick Links</h2>
				</div>
				{items.reverse()}
			</div>
		)
	}
}
