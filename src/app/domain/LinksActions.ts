
import UUID from 'uuid'
import Moment from 'moment'

import * as T from 'app/domain/Types'

export const Types = {
	CREATE_LINK: 'CREATE_LINK',
	DELETE_LINK: 'DELETE_LINK',
	UPDATE_LINK: 'UPDATE_LINK',
	SET_LINKS: 'SET_LINKS',
}


export const createLink = (title: string, url: string) => (dispatch, getState) => {

	const existingLinksOrders = getState().links.map((link) => link.order)
	const maxOrder = Math.max(...existingLinksOrders)

	dispatch({
		type: Types.CREATE_LINK,
		payload: {
			id: UUID.v1(),
			created: Moment().format(),
			updated: Moment().format(),
			order: maxOrder + 1,
			title,
			url,
		},
	})
}

export const deleteLink = (id: string) => {
	return {
		type: Types.DELETE_LINK,
		payload: {id},
	}
}

export const updateLink = (id: string, params: {title?: string}) => {
	const updated = Moment().format()
	return {
		type: Types.UPDATE_LINK,
		payload: {id, updated, params},
	}
}

export const reorderLinks = (sourceLink: T.Link, newOrder: number) => (dispatch, getState) => {

	const existingLinks = getState().links

	const leftStop = Math.min(sourceLink.order, newOrder)
	const rightStop = Math.max(sourceLink.order, newOrder)

	const reorderedLinks = existingLinks.map((link) => {
		// only relevant links
		if (link.order === sourceLink.order) {
			return {...link, order: newOrder}
		} else if (link.order >= leftStop && link.order <= rightStop) {
			if (rightStop === newOrder) {
				// shifting left
				return {...link, order: link.order - 1}
			} else {
				// shifting right
				return {...link, order: link.order + 1}
			}
		} else {
			return link
		}
	})
	const sortedLinks = reorderedLinks.sort((x, y) => x.order - y.order)
	const normalizedLinks = sortedLinks.map((link, i) => ({...link, order: i}))

	dispatch({
		type: Types.SET_LINKS,
		payload: {links: normalizedLinks},
	})
}
