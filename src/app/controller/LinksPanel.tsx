
import * as React from 'react'
import {connect} from 'react-redux'

import * as LinksActions from 'app/domain/LinksActions'
import * as Selectors from 'app/domain/Selectors'
import {AppSettings} from 'app/AppSettings'
import Link from 'app/view/Link'

const LINKS_CHECK_INTERVAL = 3000

@(connect as any)(
	(state) => {
		return {
			links: Selectors.getLinks(state),
		}
	},
	{
		createLink: LinksActions.createLink,
		deleteLink: LinksActions.deleteLink,
		updateLinkTitle: LinksActions.updateLinkTitle,
	},
)
export default class LinksPanel extends React.PureComponent<any> {

	pendingLinksTimer: number = 0

	componentDidMount () {
		this.pendingLinksTimer = window.setInterval(this.savePendingLinks, LINKS_CHECK_INTERVAL)
		this.savePendingLinks()
	}

	componentWillUnmount () {
		window.clearInterval(this.pendingLinksTimer)
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
		this.props.updateLinkTitle(id, title)
	}

	linkDeleted = (id: string) => {
		this.props.deleteLink(id)
	}

	render () {
		const {links} = this.props

		return (
			<div className='links-panel'>
				{links.map((link, i) => {
					return (
						<Link
							key={i}
							link={link}
							onTitleChange={this.titleChanged}
							onDelete={this.linkDeleted}
						/>
					)
				})}
			</div>
		)
	}
}
