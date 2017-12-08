
import {createSelector} from 'reselect'
import {TAppState} from 'app/domain/AppReducer'

export const getNotes = createSelector(
	[
		(state: TAppState) => state.notes,
	],
	(notes) => {
		return notes//.sort((x, y) => (x.updated < y.updated) ? 1 : -1)
	},
)
