import React from 'react'

export interface IState {
	hasError: boolean
}

export default class ErrorBoundary extends React.PureComponent<{}, IState> {
	public state: IState = {
		hasError: false,
	}

	public componentDidCatch(error: any) {
		this.setState({ hasError: true })
		console.error(error)
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className='error-boundary'>
					<h1> Something went wrong </h1>
					<p> See console log for more info </p>
				</div>
			)
		} else {
			return this.props.children
		}
	}
}
