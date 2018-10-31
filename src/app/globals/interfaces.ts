
export {}

declare global {

	interface ILink {
		id: string,
		position: number,
		title: string,
		url: string,
	}

	interface IUi {
		panels: {[key in EPanel]: {width: number}},
	}

	interface IStore {
		links: ILink[],
		bookmarks: {[key in EBookmarkType]: ILink[]},
		// ui: IUi,
	}

}
