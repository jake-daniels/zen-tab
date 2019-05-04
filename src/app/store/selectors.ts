import { createSelector } from 'reselect'
import { ILink, IStore } from 'app/globals/interfaces'
import { EBookmarkType, EPanel } from 'app/globals/enums'

export const getLinks = createSelector(
	[(store: IStore) => store.links],
	(links) => {
		return links
	},
)
