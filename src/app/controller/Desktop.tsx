
import * as React from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import BookmarksPanel from 'app/controller/BookmarksPanel'
import NotesPanel from 'app/controller/NotesPanel'
import LinksPanel from 'app/controller/LinksPanel'
import Clock from 'app/view/Clock'


interface TState {
	hasError: boolean,
}

class ErrorBoundary extends React.PureComponent<any, TState> {

	state: TState = {
		hasError: false,
	}

	componentDidCatch (error: any, info: any) {
		this.setState({hasError: true})
		console.log(error)
	}

	render() {
		const {hasError} = this.state

		if (hasError) {
			return (
				<div className='error-boundary'>
					<h1> Something went wrong </h1>
					<p> See console log for more info </p>
				</div>
			)
		}

		return this.props.children
	}
}


@DragDropContext(HTML5Backend)
export default class Desktop extends React.PureComponent {

	render () {
		return (
			<ErrorBoundary>
				<div className='desktop'>
					<BookmarksPanel/>
					<LinksPanel/>
					<NotesPanel/>
					<Clock/>
				</div>
			</ErrorBoundary>
		)
	}
}
