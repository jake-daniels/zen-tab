import createState from 'react-copy-write'
import UUID from 'shortid'

const LINKS = [...new Array(10)].fill(null).map((_, i) => {
	return {
		id: UUID.generate(),
		title: `Link #${i.toString()}`,
		url: 'https://www.google.cz/',
		created: new Date().toISOString(),
		updated: new Date().toISOString(),
		position: i,
	}
})

export const InitialState: IStore = {
	links: LINKS,
	bookmarks: [],
}

export const {
	Provider,
	Consumer,
	mutate,
} = createState(InitialState)
