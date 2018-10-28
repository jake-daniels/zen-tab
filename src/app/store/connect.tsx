import React, {PureComponent} from 'react'
import {Provider, Consumer, InitialState} from 'app/store/store'

class Subscriber extends PureComponent<{callback: (store: IStore) => void}> {
	public render () {
		return (
			<Consumer>
				{(store: IStore) => {
					this.props.callback(store)
					return null
				}}
			</Consumer>
		)
	}
}

export interface IProviderOptions {
	log?: boolean,
	hydrate?: boolean,
	subscribe?: (store: IStore) => void,
}

const HYDRATION_LS_KEY = 'zen-tab-app-state'

function loadStore (): IStore {
	const item = localStorage.getItem(HYDRATION_LS_KEY)
	return (item) ? JSON.parse(item) : InitialState
}

function saveStore (store: IStore) {
	const item = JSON.stringify(store)
	localStorage.setItem(HYDRATION_LS_KEY, item)
}

export function provideState (options: IProviderOptions) {

	const initialState = (options.hydrate) ? loadStore() : InitialState
	const logStore = (store: IStore) => console.log(store)

	return (Component: React.ComponentType) => {
		class ProviderWrapper extends React.Component<{}> {
			public render () {
				return (
					<Provider initialState={initialState}>
						<>
							<Component />
							{options.log && <Subscriber callback={logStore} />}
							{options.hydrate && <Subscriber callback={saveStore}/>}
							{options.subscribe && <Subscriber callback={options.subscribe}/>}
						</>
					</Provider>
				)
			}
		}
		return ProviderWrapper
	}
}

export function withState<IOwnProps, IStoreProps> (mappingFunction: (store: IStore) => object) {
	return (Component: React.ComponentType<IOwnProps & IStoreProps>) => {
		class ConsumerWrapper extends React.Component<IOwnProps & IStoreProps> {
			public render () {
				return (
					<Consumer>
						{(store: IStore) =>
							<Component {...this.props} {...mappingFunction(store)} />
						}
					</Consumer>
				)
			}
		}
		return ConsumerWrapper as any
	}
}
