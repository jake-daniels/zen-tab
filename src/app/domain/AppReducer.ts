
import {handleActions} from 'redux-actions'

import * as T from 'app/domain/Types'
import {Types as NotesActions} from 'app/domain/NotesActions'
import {Types as LinksActions} from 'app/domain/LinksActions'

export interface TAppState {
	notes: Array<T.Note>,
	links: Array<T.Link>,
}

export interface TAction {
	type: string,
	payload: any,
}

export const InitialAppState: TAppState = {
	notes: [],
	links: [],
}

export const Reducers = {

	// Notes

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
		}).sort((x, y) => (x.updated > y.updated) ? 1 : -1)

		return {...state, notes}
	},

	// Links

	[LinksActions.CREATE_LINK]: (state: TAppState, action: TAction) => {
		const newLink = {...action.payload}
		const links = [...state.links, newLink]

		return {...state, links}
	},

	[LinksActions.DELETE_LINK]: (state: TAppState, action: TAction) => {
		const {id} = action.payload
		const links = state.links.filter((item) => item.id !== id)

		return {...state, links}
	},

	[LinksActions.UPDATE_LINK]: (state: TAppState, action: TAction) => {
		const {id, updated, params} = action.payload

		const links = state.links.map((link) => {
			return (link.id === id)
				? {...link, ...params, updated}
				: link
		}).sort((x, y) => x.order - y.order)

		return {...state, links}
	},

	[LinksActions.SET_LINKS]: (state: TAppState, action: TAction) => {
		const {links} = action.payload
		return {...state, links}
	},

}


export const AppReducer = handleActions(Reducers, InitialAppState)

export default AppReducer
