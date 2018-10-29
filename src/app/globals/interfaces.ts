
export {}

declare global {

	interface ILink {
		id: string,
		position: number,
		title: string,
		url: string,
	}

	interface IStore {
		links: ILink[],
		bookmarks: ILink[],
	}

}
