
import UUID from 'uuid'
import Moment from 'moment'

import * as T from 'app/domain/Types'


export const Types = {
	CREATE_NOTE: 'CREATE_NOTE',
	DELETE_NOTE: 'DELETE_NOTE',
	UPDATE_NOTE: 'UPDATE_NOTE',
}


const DEFAULT_NOTE_SIZE = {width: 300, height: 200}
const DEFAULT_NOTE_POSITION = {x: 20, y: 20}
const DEFAULT_NOTE_OFFSET = {x: 10, y: 10}

const getFirstAvailablePosition = (notes) => {
	let pos = {...DEFAULT_NOTE_POSITION}
	let isTaken = true
	while (isTaken) {
		isTaken = notes.some((note) => (
			note.position.x === pos.x &&
			note.position.y === pos.y
		))
		if (isTaken) {
			pos.x += DEFAULT_NOTE_OFFSET.x
			pos.y += DEFAULT_NOTE_OFFSET.y
		}
	}
	return pos
}

export const createNote = (initialText?: string) => (dispatch, getState) => {
	const notes = getState().notes
	const position = getFirstAvailablePosition(notes)

	dispatch({
		type: Types.CREATE_NOTE,
		payload: {
			id: UUID.v1(),
			created: Moment().format(),
			updated: Moment().format(),
			text: initialText || '',
			size: DEFAULT_NOTE_SIZE,
			position,
		},
	})
}

export const deleteNote = (id: string) => {
	return {
		type: Types.DELETE_NOTE,
		payload: {id},
	}
}

export const updateNote = (id: string, params: {text?: string, size?: T.Size}) => {
	const updated = Moment().format()
	return {
		type: Types.UPDATE_NOTE,
		payload: {id, updated, params},
	}
}
