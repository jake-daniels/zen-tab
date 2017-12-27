
import UUID from 'uuid'
import Moment from 'moment'


export const Types = {
	CREATE_LINK: 'CREATE_LINK',
	DELETE_LINK: 'DELETE_LINK',
	UPDATE_LINK_TITLE: 'UPDATE_LINK_TITLE',
}


export const createLink = (title: string, url: string) => {
	return {
		type: Types.CREATE_LINK,
		payload: {
			id: UUID.v1(),
			created: Moment().format(),
			updated: Moment().format(),
			title,
			url,
		},
	}
}

export const deleteLink = (id: string) => {
	return {
		type: Types.DELETE_LINK,
		payload: {id},
	}
}

export const updateLinkTitle = (id: string, title: string) => {
	const updated = Moment().format()
	return {
		type: Types.UPDATE_LINK_TITLE,
		payload: {id, title, updated},
	}
}
