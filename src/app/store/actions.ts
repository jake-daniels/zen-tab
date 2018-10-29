import {mutate} from 'app/store/store'
import UUID from 'shortid'

function normalizePositions (links: ILink[]) {
	return links.map((link, i) => ({...link, position: i}))
}

export function createLink (title: string, url: string) {
	mutate((store) => {
		const newLink = {
			id: UUID.generate(),
			position: -1,
			title,
			url,
		} as ILink

		store.links.push(newLink)
		store.links = normalizePositions(store.links)
	})
}

export function deleteLink (id: string) {
	mutate((store) => {
		store.links = store.links.filter((link) => link.id !== id)
		store.links = normalizePositions(store.links)
	})
}

export function reorderLinks (sourceLink: ILink, newPosition: number) {
	mutate((store) => {
		const currentIndex = store.links.findIndex((link) => link.id === sourceLink.id)
		store.links.splice(currentIndex, 1)
		store.links.splice(newPosition, 0, sourceLink)
		store.links = normalizePositions(store.links)
	})
}

export function addBookmark (type: EBookmarkType, bookmark: ILink) {
	mutate((store) => {
		const bookmarks = store.bookmarks[type]
		bookmarks.push(bookmark)
		store.bookmarks[type] = normalizePositions(bookmarks)
	})
}

export function deleteBookmark (type: EBookmarkType, id: string) {
	mutate((store) => {
		const bookmarks = store.bookmarks[type].filter((bookmark) => bookmark.id !== id)
		store.bookmarks[type] = normalizePositions(bookmarks)
	})
}

export function reorderBookmarks (type: EBookmarkType, sourceBookmark: ILink, newPosition: number) {
	mutate((store) => {
		const bookmarks = store.bookmarks[type]
		const currentIndex = bookmarks.findIndex((link) => link.id === sourceBookmark.id)
		bookmarks.splice(currentIndex, 1)
		bookmarks.splice(newPosition, 0, sourceBookmark)
		store.bookmarks[type] = normalizePositions(bookmarks)
	})
}
