
export {}

enum EBookmarkType {
	Personal = 'Personal',
	Work = 'Work',
}

enum EPanel {
	QuickLinks = 'QuickLinks',
	PersonalBookmarks = 'PersonalBookmarks',
	WorkBookmarks = 'WorkBookmarks',
}

declare global {

	enum EBookmarkType {
		Personal = 'Personal',
		Work = 'Work',
	}

	enum EPanel {
		QuickLinks = 'QuickLinks',
		PersonalBookmarks = 'PersonalBookmarks',
		WorkBookmarks = 'WorkBookmarks',
	}

}

const GLOBAL = (window as any)
GLOBAL.EBookmarkType = EBookmarkType
GLOBAL.EPanel = EPanel
