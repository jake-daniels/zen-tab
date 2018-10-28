
import {createSelector} from 'reselect'

export const getNotes = createSelector(
	[
		(state: any) => state.notes,
	],
	(notes) => {
		return notes
	},
)

export const getLinks = createSelector(
	[
		(state: any) => state.links,
	],
	(links) => {
		return links
	},
)
