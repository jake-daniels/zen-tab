import createState from 'react-copy-write'

export const InitialState: IStore = {
	links: []
}

export const {
	Provider,
	Consumer,
	mutate,
} = createState(InitialState)
