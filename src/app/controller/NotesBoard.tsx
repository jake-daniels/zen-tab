
import * as React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'app/domain/connect'
import {DropTarget} from 'react-dnd'

import {DraggableItems} from 'app/domain/drag-and-drop'
import * as NotesActions from 'app/domain/NotesActions'
import * as NotesSelectors from 'app/domain/NotesSelectors'
import Note from 'app/view/Note'

import * as T from 'app/domain/Types'

type TProps = any

const dropTarget = {
	drop: (props: any, monitor: any, component: any) => {
		const {id} = monitor.getItem()
		const offset = monitor.getSourceClientOffset()

		const clientRect: any = ReactDOM.findDOMNode(component).getBoundingClientRect()
		const position = {
			x: (offset.x - clientRect.x),
			y: (offset.y - clientRect.y),
		}

		props.updateNote(id, {position})
	}
}
const collect = (dndConnect: any, monitor: any) => {
	return {
		connectDropTarget: dndConnect.dropTarget(),
	}
}

@connect(
	(state) => {
		return {
			notes: state.notes //NotesSelectors.getNotes(state),
		}
	},
	{
		createNote: NotesActions.createNote,
		deleteNote: NotesActions.deleteNote,
		updateNote: NotesActions.updateNote,
	},
)
@DropTarget(DraggableItems.NOTE, dropTarget, collect)
export default class NotesBoard extends React.PureComponent<TProps> {

	addNote = () => {
		this.props.createNote()
	}

	removeNote = (id: string) => {
		this.props.deleteNote(id)
	}

	updateNoteText = (id: string, text: string) => {
		this.props.updateNote(id, {text})
	}

	updateNoteSize = (id: string, size: T.Size) => {
		this.props.updateNote(id, {size})
	}

	render () {
		const {connectDropTarget} = this.props 	// DND
		const {notes} = this.props

		return connectDropTarget(
			<div className='notes-controller'>

				<div className='add-note-button' onClick={this.addNote}>
					<i className='fa fa-plus' aria-hidden={true}/>
				</div>

				<div>
					{notes.map((note, i) => {
						return (
							<Note
								key={i}
								note={note}
								onTextChange={this.updateNoteText}
								onSizeChange={this.updateNoteSize}
								onDelete={this.removeNote}
							/>
						)
					})}
				</div>

			</div>
		)
	}
}
