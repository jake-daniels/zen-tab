import {mutate} from 'app/store/store'
import UUID from 'shortid'

export function createLink (title: string, url: string) {
	mutate((store) => {
		const positions = store.links.map((link) => link.position)
		const maxPosition = Math.max(...positions)
		const newLink = {
			id: UUID.generate(),
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			position: maxPosition + 1,
			title,
			url,
		} as ILink
		store.links.push(newLink)
	})
}

export function deleteLink (id: string) {
	mutate((store) => {
		store.links = store.links.filter((link) => link.id !== id)
	})
}

export function updateLink (id: string, title: string) {
	mutate((store) => {
		const link = store.links.find((link) => link.id === id) as ILink
		link.title = title
		link.updated = new Date().toISOString()
	})
}

// export function reorderLinks (sourceLink: ILink, newOrder: number) {
// 	mutate((store) => {
// 		const existingLinks = geIState().links

// 		const leftStop = Math.min(sourceLink.order, newOrder)
// 		const rightStop = Math.max(sourceLink.order, newOrder)

// 		const orderMap = existingLinks.map((link) => {
// 			const isSourceLink = (link.order === sourceLink.order)
// 			const isBetween = (link.order >= leftStop && link.order <= rightStop)
// 			const shiftLeft = (rightStop === newOrder)

// 			if (isSourceLink) {
// 				return {current: link.order, next: newOrder}
// 			}

// 			if (isBetween) {
// 				return (shiftLeft)
// 					? {current: link.order, next: link.order - 1}
// 					: {current: link.order, next: link.order + 1}
// 			}

// 			return {current: link.order, next: link.order}
// 		})

// 		dispatch({
// 			type: Types.REORDER_LINKS,
// 			payload: {orderMap},
// 		})
// 	})
// }
