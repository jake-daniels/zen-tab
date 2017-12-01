import * as React from 'react'
import {connect} from 'app/domain/connect'
import Clock from 'app/view/Clock'
import * as NotesActions from 'app/domain/NotesActions'
import Note from 'app/view/Note'

type TProps = any

@connect(
	(state) => {
		return {
			notes: state.notes,
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
						return <Note key={i} {...note} onDelete={() => this.removeNote(note.id)}/>
					})}
				</div>

			</div>
		)
	}
}
