import React from 'react'

export interface IState {
	hasError: boolean,
}

export default class ErrorBoundary extends React.PureComponent<{}, IState> {

	state: IState = {
		hasError: false,
	}

	componentDidCatch (error: any, info: any) {
		this.setState({hasError: true})
		console.log(error)
	}

	render () {
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
