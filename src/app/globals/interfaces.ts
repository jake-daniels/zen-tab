import { EBookmarkType } from './enums'

export interface ILink {
	id: string
	position: number
	title: string
	url: string
	useFavicon?: boolean
}

export interface IStore {
	links: ILink[]
	bookmarks: { [key in EBookmarkType]: ILink[] }
}
