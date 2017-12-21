
import * as React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {DropTarget} from 'react-dnd'

import {AppSettings} from 'app/AppSettings'
import {DraggableItems} from 'app/domain/drag-and-drop'
import * as NotesActions from 'app/domain/NotesActions'
import * as NotesSelectors from 'app/domain/NotesSelectors'
import Note from 'app/view/Note'

import * as T from 'app/domain/Types'

const CONTEXT_MENU_ID = 'notes-board-context-menu'

type TProps = any
type TState = {
	contextMenu: {
		isActive: boolean,
		position: T.Position,
	},
}

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
@DropTarget(DraggableItems.NOTE, dropTarget, collect)
export default class NotesBoard extends React.PureComponent<TProps, TState> {

	state: TState = {
		contextMenu: {
			isActive: false,
			position: {x: 0, y: 0},
		},
	}

	componentDidMount () {
		const board = document.getElementById(CONTEXT_MENU_ID)
		if (board) {
			board.addEventListener('contextmenu', this.showContextMenu, false)
			board.addEventListener('click', this.hideContextMenu , false)
		}

		this.savePendingLinks()
	}

	componentWillUnmount () {
		const board = document.getElementById(CONTEXT_MENU_ID)
		if (board) {
			board.removeEventListener('contextmenu', this.showContextMenu, false)
			board.removeEventListener('click', this.hideContextMenu , false)
		}
	}

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

	showContextMenu = (e) => {
		if ((e.target as any).id === CONTEXT_MENU_ID) {
			const {offsetX, offsetY} = e
			const contextMenu = {
				isActive: true,
				position: {
					x: offsetX,
					y: offsetY,
				},
			}
			this.setState({contextMenu})
			e.preventDefault()
		}
	}

	hideContextMenu = () => {
		const contextMenu = {
			isActive: false,
			position: {x: 0, y: 0},
		}
		this.setState({contextMenu})
	}

	addNote = () => {
		this.props.createNote()
		this.hideContextMenu()
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
		const {contextMenu} = this.state
		const contextMenuPositionStyle = {
			left: contextMenu.position.x,
			top: contextMenu.position.y,
		}

		return connectDropTarget(
			<div className='notes-board'>

				<div className='notes-container' id={CONTEXT_MENU_ID}>
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

				{(contextMenu.isActive) && (
					<div
						className='menu-item noselect'
						style={contextMenuPositionStyle}
						onClick={this.addNote}
					>
						<i className='fa fa-plus'/>
						<span> Add new note </span>
					</div>
				)}

			</div>
		)
	}
}
