
import {handleActions} from 'redux-actions'
import * as T from 'app/domain/Types'
import {Types as NotesActions} from 'app/domain/NotesActions'

export type TAppState = {
	notes: Array<T.Note>,
}

export type TAction = {
	type: string,
	payload: any,
}

export const InitialAppState: TAppState = {
	notes: [],
}

export const AppReducer = handleActions(
	{
		[NotesActions.CREATE_NOTE]: (state: TAppState, action: TAction) => {
			const newNote = {...action.payload}
			const notes = [...state.notes, newNote]

			return {...state, notes}
		},

		[NotesActions.DELETE_NOTE]: (state: TAppState, action: TAction) => {
			const {id} = action.payload
			const notes = state.notes.filter((item) => item.id !== id)

			return {...state, notes}
		},

		[NotesActions.UPDATE_NOTE]: (state: TAppState, action: TAction) => {
			const {id, updated, params} = action.payload

			const notes = state.notes.map((note) => {
				return (note.id === id)
					? {...note, ...params, updated}
					: note
			})

			return {...state, notes}
		},
	},
	InitialAppState,
)

export default AppReducer
