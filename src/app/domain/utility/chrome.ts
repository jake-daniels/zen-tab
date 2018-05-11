
export interface IChrome {
	bookmarks: {
		getTree: Function,
	},
}

export const chrome = {
	bookmarks: {
		getTree: (fn) => fn(),
	}
}
