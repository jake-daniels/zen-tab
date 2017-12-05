import * as React from 'react'
import {connect} from 'app/domain/connect'
import Clock from 'app/view/Clock'
import * as NotesActions from 'app/domain/NotesActions'
import * as NotesSelectors from 'app/domain/NotesSelectors'
import Note from 'app/view/Note'

import * as T from 'app/domain/Types'

type TProps = any

@connect(
	(state) => {
		return {
			notes: NotesSelectors.getNotes(state),
		}
	},
	{
		createNote: NotesActions.createNote,
		deleteNote: NotesActions.deleteNote,
		updateNote: NotesActions.updateNote,
	}
)
export default class Workspace extends React.PureComponent<TProps> {

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
		const {notes} = this.props

		return (
			<div className='workspace'>

				<Clock/>

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
