
import * as React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'app/domain/connect'
import {DropTarget} from 'react-dnd'

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
	},
)
// @DropTarget(DraggableItems.NOTE, dropTarget, collect)
export default class NotesBoard extends React.PureComponent<TProps, TState> {

	state: TState = {
		contextMenu: {
			isActive: false,
			position: {x: 0, y: 0},
		},
	}

	onContextMenu = (e) => {
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

	onClick = (e) => {
		const contextMenu = {
			isActive: false,
			position: {x: 0, y: 0},
		}
		this.setState({contextMenu})
	}

	componentDidMount () {
		document.addEventListener('contextmenu', this.onContextMenu, false)
		document.addEventListener('click', this.onClick , false)
	}

	componentWillUnmount () {
		document.removeEventListener('contextmenu', this.onContextMenu)
		document.removeEventListener('click', this.onClick)
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
		const {contextMenu} = this.state
		const contextMenuPositionStyle = {
			left: contextMenu.position.x,
			top: contextMenu.position.y,
			// isVisible: contextMenu.isActive,
		}

		console.log(this.state.contextMenu)

		return (
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
					>
						<i className='fa fa-plus'/>
						<span> Add new note </span>
					</div>
				)}

			</div>
		)
	}
}
