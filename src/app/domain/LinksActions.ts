
import UUID from 'uuid'
import Moment from 'moment'

import * as T from 'app/domain/Types'

export const Types = {
	CREATE_LINK: 'CREATE_LINK',
	DELETE_LINK: 'DELETE_LINK',
	UPDATE_LINK: 'UPDATE_LINK',
	REORDER_LINKS: 'REORDER_LINKS',
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

	const orderMap = existingLinks.map((link) => {
		const isSourceLink = (link.order === sourceLink.order)
		const isBetween = (link.order >= leftStop && link.order <= rightStop)
		const shiftLeft = (rightStop === newOrder)

		if (isSourceLink) {
			return {current: link.order, next: newOrder}
		}

		if (isBetween) {
			return (shiftLeft)
				? {current: link.order, next: link.order - 1}
				: {current: link.order, next: link.order + 1}
		}

		return {current: link.order, next: link.order}
	})

	dispatch({
		type: Types.REORDER_LINKS,
		payload: {orderMap},
	})
}
