import {createSelector} from 'reselect'

export const getLinks = createSelector(
	[
		(store: IStore) => store.links,
	],
	(links) => {
		return links
	},
)
