
import UUID from 'uuid'
import Moment from 'moment'

import * as T from 'app/domain/Types'

export const Types = {
	CREATE_LINK: 'CREATE_LINK',
	DELETE_LINK: 'DELETE_LINK',
	UPDATE_LINK: 'UPDATE_LINK',
	REORDER_LINKS: 'REORDER_LINKS',
}


export const createLink = (title: string, url: string) => (dispatch, geIState) => {

	const existingLinksOrders = geIState().links.map((link) => link.order)
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

export const reorderLinks = (sourceLink: T.ILink, newOrder: number) => (dispatch, geIState) => {

	const existingLinks = geIState().links

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

// {
// 	[LinksActions.CREATE_LINK]: (state: TAppState, action: TAction) => {
// 		const newLink = {...action.payload}
// 		const links = [...state.links, newLink]

// 		return {...state, links}
// 	},

// 		[LinksActions.DELETE_LINK]: (state: TAppState, action: TAction) => {
// 			const {id} = action.payload
// 			const links = state.links.filter((item) => item.id !== id)

// 			return {...state, links}
// 		},

// 			[LinksActions.UPDATE_LINK]: (state: TAppState, action: TAction) => {
// 				const {id, updated, params} = action.payload

// 				const links = state.links.map((link) => {
// 					return (link.id === id)
// 						? {...link, ...params, updated}
// 						: link
// 				}).sort((x, y) => x.order - y.order)

// 				return {...state, links}
// 			},

// 				[LinksActions.REORDER_LINKS]: (state: TAppState, action: TAction) => {
// 					const {orderMap} = action.payload

// 					const reorderedLinks = state.links.map((link) => {
// 						const order = orderMap.find((item) => item.current === link.order)
// 						return {...link, order: order.next}
// 					})
// 					const sortedLinks = reorderedLinks.sort((x, y) => x.order - y.order)
// 					const normalizedLinks = sortedLinks.map((link, i) => ({...link, order: i}))

// 					return {...state, links: normalizedLinks}
// 				},
// }
