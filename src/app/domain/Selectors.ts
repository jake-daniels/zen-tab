
import {createSelector} from 'reselect'
import {TAppState} from 'app/domain/AppReducer'

export const getNotes = createSelector(
	[
		(state: TAppState) => state.notes,
	],
	(notes) => {
		return notes
	},
)

export const getLinks = createSelector(
	[
		(state: TAppState) => state.links,
	],
	(links) => {
		return links
	},
)
