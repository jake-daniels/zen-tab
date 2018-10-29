
export {}

enum EBookmarkType {
	Personal = 'Personal',
	Work = 'Work',
}

declare global {

	enum EBookmarkType {
		Personal = 'Personal',
		Work = 'Work',
	}

}

const GLOBAL = (window as any)
GLOBAL.EBookmarkType = EBookmarkType
