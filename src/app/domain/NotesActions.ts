
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


export const createNote = ({position}: any) => {
	return {
		type: Types.CREATE_NOTE,
		payload: {
			id: UUID.v1(),
			created: Moment().format(),
			updated: Moment().format(),
			text: '',
			size: DEFAULT_NOTE_SIZE,
			position: position || DEFAULT_NOTE_POSITION,
		},
	}
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
