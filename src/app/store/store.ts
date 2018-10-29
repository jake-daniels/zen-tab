import createState from 'react-copy-write'

export const InitialState: IStore = {
	links: [],
	bookmarks: {
		[EBookmarkType.Personal]: [],
		[EBookmarkType.Work]: [],
	},
}

export const {
	Provider,
	Consumer,
	mutate,
} = createState(InitialState)
