import createState from 'react-copy-write'

export const InitialState: IStore = {
	links: [],
	bookmarks: {
		[EBookmarkType.Personal]: [],
		[EBookmarkType.Work]: [],
	},
	// ui: {
	// 	panels: {
	// 		[EPanel.QuickLinks]: {width: 300},
	// 		[EPanel.PersonalBookmarks]: {width: 300},
	// 		[EPanel.WorkBookmarks]: {width: 300},
	// 	},
	// }
}

export const {
	Provider,
	Consumer,
	mutate,
} = createState(InitialState)
