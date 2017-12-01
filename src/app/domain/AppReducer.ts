
import {handleActions} from 'redux-actions'
import * as NotesActions from 'app/domain/NotesActions'

type TNote = {
	id: string,
	created: string,
	data: string,
}

export type TAppState = {
	notes: Array<TNote>,
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
		[NotesActions.Types.CREATE_NOTE]: (state: TAppState, action: TAction) => {
			const newNote = {...action.payload}
			const notes = [...state.notes, newNote]
			return {...state, notes}
		},

		[NotesActions.Types.DELETE_NOTE]: (state: TAppState, action: TAction) => {
			const {id} = action.payload
			const notes = state.notes.filter((item) => item.id !== id)
			return {...state, notes}
		},

		[NotesActions.Types.UPDATE_NOTE]: (state: TAppState, action: TAction) => {
			const {id, data} = action.payload
			const note = state.notes.find((item) => item.id === id)
			const newNote = {...note, data}
			const otherNotes = state.notes.filter((item) => item.id !== id)
			const notes = [...otherNotes, newNote]
			return {...state, notes}
		},
	},
	InitialAppState,
)

export default AppReducer
