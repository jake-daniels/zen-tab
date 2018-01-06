
import * as React from 'react'
import {connect} from 'react-redux'
import {Set} from 'immutable'

import * as T from 'app/domain/Types'
import * as NotesActions from 'app/domain/NotesActions'
import * as Selectors from 'app/domain/Selectors'
import {NoteDropTarget, CustomDragLayer} from 'app/domain/drag-and-drop'
import {ContextMenuTrigger, ContextMenu, MenuItem} from 'app/domain/context-menu'
import Note from 'app/view/Note'


const CONTEXT_MENU_ID = 'notes-panel-context'

interface TState {
	contextMenuPosition: T.Position,
	dragMode: boolean,
}

@(connect as any)(
	(state) => {
		return {
			notes: Selectors.getNotes(state),
		}
	},
	{
		createNote: NotesActions.createNote,
		deleteNote: NotesActions.deleteNote,
		updateNote: NotesActions.updateNote,
	},
)
@NoteDropTarget()
export default class NotesPanel extends React.PureComponent<any, TState> {

	state: TState = {
		contextMenuPosition: {x: 0, y: 0},
		dragMode: false,
	}

	_notes: any = {}

	activateDragMode = (e) => {
		if (e.key === 'Control') {
			this.setState({dragMode: true})
		}
	}

	deactivateDragMode = (e) => {
		if (e.key === 'Control') {
			this.setState({dragMode: false})
		}
	}

	componentDidMount () {
		document.addEventListener('keydown', this.activateDragMode, false)
		document.addEventListener('keyup', this.deactivateDragMode, false)
	}

	componentWillUnmount () {
		document.removeEventListener('keydown', this.activateDragMode, false)
		document.removeEventListener('keyup', this.deactivateDragMode, false)
	}

	componentWillReceiveProps (nextProps: any) {
		this.focusNewNote(nextProps)
	}

	focusNewNote = (nextProps: any) => {
		const currentNotes = Set<T.Note>(this.props.notes)
		const nextNotes = Set<T.Note>(nextProps.notes)

		if (nextNotes.size > currentNotes.size) {
			const newNote = nextNotes.subtract(currentNotes).first()
			window.setTimeout(() => {
				const ref = this._notes[newNote.id]
				if (ref) {
					ref.decoratedComponentInstance.edit()
				}
			}, 250)
		}
	}

	addNote = () => {
		const defaults = {
			position: this.state.contextMenuPosition,
		}
		this.props.createNote(defaults)
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

	onMenuActive = (position: T.Position) => {
		this.setState({contextMenuPosition: position})
	}

	render () {
		const {connectDropTarget} = this.props 	// DND
		const {notes} = this.props
		const {dragMode} = this.state

		this._notes = {}

		return connectDropTarget(
			<div className='notes-panel'>

				<ContextMenuTrigger id={CONTEXT_MENU_ID} onMenuActive={this.onMenuActive}>
					<div className='notes-container'>
						{notes.map((note) => {
							return (
								<Note
									ref={(x) => x && (this._notes[note.id] = x)}
									key={note.id}
									dragMode={dragMode}
									note={note}
									onTextChange={this.updateNoteText}
									onSizeChange={this.updateNoteSize}
									onDelete={this.removeNote}
								/>
							)
						})}
					</div>
				</ContextMenuTrigger>

				<ContextMenu id={CONTEXT_MENU_ID}>
					<MenuItem className='menu-item noselect' onClick={this.addNote}>
						<i className='fa fa-plus'/>
						<span> Add new note </span>
					</MenuItem>
				</ContextMenu>

				<CustomDragLayer/>

			</div>
		)
	}
}
