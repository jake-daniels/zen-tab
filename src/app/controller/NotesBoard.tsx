
import * as React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import {AppSettings} from 'app/AppSettings'
import {NoteDropTarget} from 'app/domain/drag-and-drop'
import {ContextMenuTrigger, ContextMenu, MenuItem} from 'app/domain/context-menu'
import * as NotesActions from 'app/domain/NotesActions'
import * as NotesSelectors from 'app/domain/NotesSelectors'
import Note from 'app/view/Note'

import * as T from 'app/domain/Types'

const CONTEXT_MENU_ID = 'notes-board-context-menu'

type TProps = any


@(connect as any)(
	(state) => {
		return {
			notes: NotesSelectors.getNotes(state),
		}
	},
	{
		createNote: NotesActions.createNote,
		deleteNote: NotesActions.deleteNote,
		updateNote: NotesActions.updateNote,
	},
)
@NoteDropTarget()
export default class NotesBoard extends React.PureComponent<TProps> {

	savePendingLinks = () => {
		const tmpStoreEncoded = localStorage.getItem(AppSettings.LS_KEYS.TmpStore)
		const tmpStore = (tmpStoreEncoded) ? JSON.parse(tmpStoreEncoded) : {}
		if (Array.isArray(tmpStore.linksToSave)) {
			tmpStore.linksToSave.forEach((link) => {
				const text = `${link.title}\n${link.url}`
				this.props.createNote(text)
			})
			tmpStore.linksToSave = []
			localStorage.setItem(AppSettings.LS_KEYS.TmpStore, JSON.stringify(tmpStore))
		}
	}

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
			<div className='notes-board'>

				<ContextMenuTrigger id={CONTEXT_MENU_ID}>
					<div className='notes-container'>
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
				</ContextMenuTrigger>

				<ContextMenu id={CONTEXT_MENU_ID}>
					<MenuItem className='menu-item noselect' onClick={this.addNote}>
						<i className='fa fa-plus'/>
						<span> Add new note </span>
					</MenuItem>
				</ContextMenu>

			</div>
		)
	}
}
