
import UUID from 'uuid'
import Moment from 'moment'

import * as T from 'app/domain/Types'

export const Types = {
	CREATE_NOTE: 'CREATE_NOTE',
	DELETE_NOTE: 'DELETE_NOTE',
	UPDATE_NOTE: 'UPDATE_NOTE',
}

export const createNote = () => {
	return {
		type: Types.CREATE_NOTE,
		payload: {
			id: UUID.v1(),
			created: Moment().format(),
			updated: Moment().format(),
			text: '',
			size: {
				width: 200,
				height: 200,
			},
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
