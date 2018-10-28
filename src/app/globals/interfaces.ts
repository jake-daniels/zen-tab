
export {}

declare global {

	interface ILink {
		id: string,
		created: string,
		updated: string,
		position: number,
		title: string,
		url: string,
	}

	interface IStore {
		links: ILink[],
	}

}
