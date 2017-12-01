import UUID from 'uuid'
import Moment from 'moment'

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
			data: '',
		},
	}
}

export const deleteNote = (id: string) => {
	return {
		type: Types.DELETE_NOTE,
		payload: {id},
	}
}

export const updateNote = (id: string, data: string) => {
	return {
		type: Types.UPDATE_NOTE,
		payload: {id, data},
	}
}
